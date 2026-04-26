import joblib
import pandas as pd
import time
import logging
from src.models.model_registry import registry, ModelMetadata

# =========================
# LOAD MODEL + COMPONENTS
# =========================

try:
    model = joblib.load("models/random_forest_model.joblib")
    encoder = joblib.load("models/encoder.joblib")
    imputer = joblib.load("models/imputer.joblib")
    logging.info("Clinical model loaded successfully")

    # Register so /models endpoint shows it
    registry.register_model(
        "clinical_model",
        model,
        ModelMetadata(
            name="clinical_model",
            version="1.0",
            accuracy=0.74,
            f1_score=0.65,
            created_date="2026-04-20",
            description="Random Forest for breast cancer recurrence prediction"
        )
    )

except Exception as e:
    model = None
    encoder = None
    imputer = None
    logging.error(f"Error loading clinical components: {e}")


# =========================
# PREDICTION FUNCTION
# =========================

def predict_clinical(data):
    if model is None or encoder is None or imputer is None:
        raise Exception("Model or preprocessing components not loaded")

    if data.node_caps == "yes" and data.inv_nodes == "0-2":
        raise Exception("Invalid combination: node_caps cannot be 'yes' when inv_nodes is '0-2'")

    input_dict = {
        "age": [data.age],
        "menopause": [data.menopause],
        "tumor_size": [data.tumor_size],
        "inv_nodes": [data.inv_nodes],
        "node_caps": [data.node_caps],
        "deg_malig": [data.deg_malig],
        "breast": [data.breast],
        "breast_quad": [data.breast_quad],
        "irradiat": [data.irradiat]
    }

    df = pd.DataFrame(input_dict)
    df_imputed = imputer.transform(df)
    df_encoded = encoder.transform(df_imputed)
    feature_names = encoder.get_feature_names_out()
    df_encoded = pd.DataFrame(df_encoded, columns=feature_names)

    start = time.time()
    prediction_raw = model.predict(df_encoded)[0]
    confidence = max(model.predict_proba(df_encoded)[0])
    end = time.time()

    label_map = {
        "no-recurrence-events": "No Recurrence",
        "recurrence-events": "Recurrence Risk"
    }

    prediction = label_map.get(prediction_raw, prediction_raw)
    confidence_percent = round(float(confidence) * 100, 2)  # e.g. 75.23

    return {
        "prediction": prediction,
        "confidence": confidence_percent,
        "response_time": round(end - start, 4)
    }