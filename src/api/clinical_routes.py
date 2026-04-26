from fastapi import APIRouter, HTTPException
from typing import List
import logging

from src.api.schema import PatientData
from src.api.utils.clinical_utils import predict_clinical, model, encoder
from src.utils.interpretability import get_feature_importance, interpret_clinical_prediction

router = APIRouter()
logger = logging.getLogger(__name__)


# =========================
# HELPER
# =========================

def _get_risk_level(confidence: float) -> str:
    """confidence is 0-100 scale"""
    if confidence > 70:
        return "High Risk"
    elif confidence > 40:
        return "Moderate Risk"
    else:
        return "Low Risk"


# =========================
# STANDARD PREDICT
# =========================

@router.post("/predict-clinical")
def predict(data: PatientData):
    """Predict breast cancer recurrence from clinical data."""
    try:
        logger.info(f"Clinical request received: {data.model_dump()}")
        result = predict_clinical(data)
        return {
            "prediction": result["prediction"],
            "confidence": result["confidence"],   # 0-100, e.g. 75.23
            "response_time": result["response_time"],
            "status": "success"
        }
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Validation error: {str(e)}")
    except Exception as e:
        logger.error(f"Clinical prediction error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Clinical prediction failed: {str(e)}")


# =========================
# PREDICT WITH EXPLANATION
# =========================

@router.post("/predict-clinical-with-explanation")
def predict_with_explanation(data: PatientData):
    """Same as /predict-clinical but also returns feature importance."""
    try:
        result = predict_clinical(data)
        prediction = result["prediction"]
        confidence = result["confidence"]  # 0-100

        feature_names = encoder.get_feature_names_out().tolist()
        feature_importance = get_feature_importance(model, feature_names, top_n=3)

        # interpret_clinical_prediction expects 0-1 confidence, so divide by 100
        interpretation = interpret_clinical_prediction(
            prediction=prediction,
            confidence=confidence / 100,
            feature_importance=feature_importance
        )

        return {
            "prediction": prediction,
            "confidence": confidence,
            "response_time": result["response_time"],
            "risk_level": _get_risk_level(confidence),
            "explanation": interpretation,
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Explanation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# BATCH PREDICT
# =========================

@router.post("/predict-batch")
def predict_batch(patients: List[PatientData]):
    """Predict for a list of patients at once."""
    if not patients:
        raise HTTPException(status_code=400, detail="Patient list is empty")

    results = []
    for idx, patient in enumerate(patients):
        try:
            result = predict_clinical(patient)
            results.append({
                "patient_index": idx,
                "prediction": result["prediction"],
                "confidence": result["confidence"],
                "risk_level": _get_risk_level(result["confidence"]),
                "status": "success"
            })
        except Exception as e:
            results.append({
                "patient_index": idx,
                "status": "error",
                "error": str(e)
            })

    return {
        "total_patients": len(patients),
        "successful_predictions": sum(1 for r in results if r["status"] == "success"),
        "failed_predictions": sum(1 for r in results if r["status"] == "error"),
        "predictions": results
    }