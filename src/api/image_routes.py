from fastapi import APIRouter, UploadFile, File, HTTPException
import logging

from src.api.utils.image_utils import predict_image

# 🔥 THIS LINE IS CRITICAL
router = APIRouter()

@router.post("/predict-image")
async def predict(file: UploadFile = File(...)):
    try:
        logging.info(f"Image received: {file.filename}")

        # Validate file type
        if not file.filename.endswith((".jpg", ".jpeg", ".png")):
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only JPG and PNG allowed."
            )

        result = predict_image(file)

        return {
            "prediction": result["prediction"],
            "confidence": result["confidence"]
        }

    except HTTPException as http_err:
        raise http_err

    except Exception as e:
        logging.error(f"Image prediction error: {str(e)}")

        raise HTTPException(
            status_code=500,
            detail=f"Image prediction failed: {str(e)}"
        )