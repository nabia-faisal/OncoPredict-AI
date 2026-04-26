import logging
import numpy as np
import cv2
from tensorflow.keras.models import load_model  # pyright: ignore

from src.image_model.config import MODEL_PATH, IMAGE_SIZE

# =========================
# LOAD REAL MODEL
# =========================

try:
    model = load_model(MODEL_PATH)
    logging.info("Image model loaded successfully")
except Exception as e:
    model = None
    logging.error(f"Image model could not be loaded: {e}")


# =========================
# PREDICT FUNCTION
# =========================

def predict_image(file):
    """
    Accepts a FastAPI UploadFile, preprocesses it, and returns prediction.
    """
    if model is None:
        return {
            "prediction": "Model not ready",
            "confidence": 0.0
        }

    try:
        # Read bytes from uploaded file
        file_bytes = file.file.read()

        # Decode to numpy image
        np_arr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Could not decode image — check the file is a valid JPG or PNG")

        # Resize and normalise to match training
        img = cv2.resize(img, IMAGE_SIZE)
        img = img / 255.0
        img = np.expand_dims(img, axis=0)  # shape: (1, 224, 224, 3)

        # Predict
        pred = model.predict(img)
        confidence = float(pred[0][0])

        label = "Cancer Detected" if confidence > 0.5 else "No Cancer"

        # Show confidence as how sure we are of the predicted label
        display_confidence = confidence if confidence > 0.5 else round(1 - confidence, 3)

        return {
            "prediction": label,
            "confidence": display_confidence
        }

    except Exception as e:
        logging.error(f"Image prediction error: {str(e)}")
        raise