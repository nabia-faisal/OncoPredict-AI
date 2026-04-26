import logging
import numpy as np
from tensorflow.keras.models import load_model # pyright: ignore[reportMissingModuleSource]

from src.image_model.preprocessing import preprocess_image
from src.image_model.config import MODEL_PATH

# =========================
# LOAD MODEL (SAFE)
# =========================

try:
    model = load_model(MODEL_PATH)
    logging.info("Image model loaded successfully")
except Exception as e:
    model = None
    logging.warning("Image model not found yet. Using placeholder.")


# =========================
# PREDICT FUNCTION
# =========================

def predict_image(file):
    """
    Predict cancer from uploaded image
    """

    if model is None:
        return {
            "prediction": "Model not ready",
            "confidence": 0.0
        }

    try:
        # Preprocess image
        img = preprocess_image(file)

        # Predict
        pred = model.predict(img)
        confidence = float(pred[0][0])

        # Label
        if confidence > 0.5:
            label = "Cancer Detected"
        else:
            label = "No Cancer"

        return {
            "prediction": label,
            "confidence": round(confidence, 3)
        }

    except Exception as e:
        logging.error(f"Image prediction error: {str(e)}")

        return {
            "prediction": "Error",
            "confidence": 0.0
        }