import cv2
import numpy as np

from src.image_model.config import IMAGE_SIZE


# =========================
# LOAD + PREPROCESS IMAGE
# =========================

def preprocess_image(file):
    """
    Used during API prediction
    Converts uploaded file → model-ready format
    """

    # Read file as bytes
    file_bytes = file.read()

    # Convert to numpy array
    np_arr = np.frombuffer(file_bytes, np.uint8)

    # Decode image
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Invalid image file")

    # Resize
    img = cv2.resize(img, IMAGE_SIZE)

    # Normalize (0 → 1)
    img = img / 255.0

    # Add batch dimension
    img = np.expand_dims(img, axis=0)

    return img


# =========================
# LOAD IMAGE FROM PATH (TRAINING)
# =========================

def preprocess_image_from_path(image_path):
    """
    Used during training
    """

    img = cv2.imread(image_path)

    if img is None:
        raise ValueError(f"Could not read image: {image_path}")

    img = cv2.resize(img, IMAGE_SIZE)
    img = img / 255.0

    return img