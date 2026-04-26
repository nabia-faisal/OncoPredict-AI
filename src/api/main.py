from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
from src.api.image_routes import router as image_router
from src.api.clinical_routes import router as clinical_router
from src.api.multimodal_routes import router as multimodal_router
from src.models.model_registry import registry

app = FastAPI(
    title="Medical AI API",
    description="Confidence-Aware Medical AI Inference Service",
    version="1.0.0"
)

# =========================
# CORS CONFIGURATION
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production replace with: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# LOGGING
# =========================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# =========================
# GLOBAL ERROR HANDLER
# =========================
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": str(exc)
        }
    )

# =========================
# STARTUP EVENT
# =========================
@app.on_event("startup")
async def startup_event():
    logger.info("Medical AI API Starting...")
    logger.info("Clinical model loaded")
    logger.info("Image model loaded")
    logger.info("API ready for predictions")

# =========================
# HOME ENDPOINT
# =========================
@app.get("/")
def home():
    return {
        "message": "Medical AI API is running",
        "version": "1.0.0",
        "endpoints": {
            "clinical": "/predict-clinical",
            "image": "/predict-image",
            "multimodal": "/predict-multimodal"
        },
        "docs": "/docs"
    }

# =========================
# HEALTH CHECK
# =========================
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "API is functioning normally"
    }

# =========================
# MODEL LIST ENDPOINT
# =========================
@app.get("/models")
def list_available_models():
    """List all available models and their metadata"""
    return {
        "available_models": registry.list_models()
    }

# =========================
# API INFO ENDPOINT
# =========================
@app.get("/api-info")
def api_info():
    """Returns information about available endpoints and their formats"""
    return {
        "clinical_endpoint": {
            "path": "/predict-clinical",
            "method": "POST",
            "description": "Predict breast cancer recurrence from clinical data",
            "example_input": {
                "age": "30-39",
                "menopause": "premeno",
                "tumor_size": "15-19",
                "inv_nodes": "0-2",
                "node_caps": "no",
                "deg_malig": "2",
                "breast": "left",
                "breast_quad": "left_low",
                "irradiat": "no"
            },
            "example_output": {
                "prediction": "No Recurrence",
                "confidence": 75.23,
                "response_time": 0.034
            }
        },
        "image_endpoint": {
            "path": "/predict-image",
            "method": "POST",
            "description": "Predict cancer from medical image",
            "input": "Image file (.jpg, .png)",
            "example_output": {
                "prediction": "No Cancer",
                "confidence": 0.92
            }
        },
        "multimodal_endpoint": {
            "path": "/predict-multimodal",
            "method": "POST",
            "description": "Combine clinical data and image for robust prediction",
            "can_provide": "Clinical data only, Image only, or Both",
            "example_output": {
                "combined_confidence": "83.58%",
                "risk_level": "Moderate Risk",
                "interpretation": "Moderate risk — further diagnostic testing advised."
            }
        }
    }

# =========================
# INCLUDE ROUTERS
# =========================
app.include_router(clinical_router, tags=["Clinical"])
app.include_router(image_router, tags=["Image"])
app.include_router(multimodal_router, tags=["MultiModal"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)