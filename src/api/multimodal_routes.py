from fastapi import APIRouter, UploadFile, File, HTTPException, Form
import logging
import json

from src.api.schema import PatientData
from src.api.utils.clinical_utils import predict_clinical
from src.api.utils.image_utils import predict_image
from src.utils.ensemble import ensemble
from src.utils.analytics import prediction_logger

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/predict-multimodal")
async def predict(
    data: str = Form(None),
    file: UploadFile = File(None)
):
    """
    Multimodal prediction: accepts clinical data, an image, or both.
    When both are provided, uses Bayesian fusion to combine confidences.
    """
    import time
    start = time.time()

    try:
        logger.info("Multimodal request received")

        # =========================
        # PARSE CLINICAL DATA
        # =========================
        clinical_data = None
        if data and data.strip():
            try:
                parsed = json.loads(data)
                clinical_data = PatientData(**parsed)
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid clinical data format")

        # =========================
        # REQUIRE AT LEAST ONE INPUT
        # =========================
        has_image = file is not None and file.filename != ""
        if clinical_data is None and not has_image:
            raise HTTPException(
                status_code=400,
                detail="Provide at least clinical data or an image file"
            )

        # =========================
        # RUN PREDICTIONS
        # =========================
        clinical_result = None
        image_result = None

        if clinical_data:
            clinical_result = predict_clinical(clinical_data)

        if has_image:
            if not file.filename.lower().endswith((".jpg", ".jpeg", ".png")):
                raise HTTPException(status_code=400, detail="Invalid file type — use .jpg or .png")
            image_result = predict_image(file)

        # =========================
        # FUSE CONFIDENCES
        # =========================
        combined_confidence = None

        if clinical_result and image_result:
            # Both available — use Bayesian fusion (inputs normalised to 0-1)
            fused = ensemble.bayesian_fusion(
                clinical_conf=clinical_result["confidence"] / 100,
                image_conf=image_result["confidence"],
                clinical_reliability=0.85,
                image_reliability=0.80
            )
            combined_confidence = fused * 100   # back to 0-100 for display

        elif clinical_result:
            combined_confidence = clinical_result["confidence"]

        elif image_result:
            combined_confidence = image_result["confidence"] * 100

        # =========================
        # RISK + INTERPRETATION
        # =========================
        risk_level = None
        interpretation = None
        confidence_percent = None

        if combined_confidence is not None:
            confidence_percent = f"{round(combined_confidence, 2)}%"

            if combined_confidence > 70:
                risk_level = "High Risk"
                interpretation = "High likelihood of cancer — immediate medical attention recommended."
            elif combined_confidence > 40:
                risk_level = "Moderate Risk"
                interpretation = "Moderate risk — further diagnostic testing advised."
            else:
                risk_level = "Low Risk"
                interpretation = "Low risk — routine monitoring recommended."

        response = {
            "clinical": clinical_result,
            "image": image_result,
            "combined_confidence": confidence_percent,
            "risk_level": risk_level,
            "interpretation": interpretation,
            "fusion_method": "Bayesian (reliability-weighted)" if (clinical_result and image_result) else "Single model"
        }

        # Log the prediction
        prediction_logger.log_prediction(
            prediction_type="multimodal",
            input_data={"clinical": bool(clinical_data), "image": bool(has_image)},
            output={"risk_level": risk_level, "combined_confidence": confidence_percent},
            response_time=time.time() - start,
            success=True
        )

        return response

    except HTTPException:
        raise

    except Exception as e:
        prediction_logger.log_prediction(
            prediction_type="multimodal",
            input_data={},
            output={},
            response_time=time.time() - start,
            success=False,
            error=str(e)
        )
        logger.error(f"Multimodal error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Multimodal prediction failed: {str(e)}")