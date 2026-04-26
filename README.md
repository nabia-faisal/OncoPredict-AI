# OncoPredict AI

A breast cancer prediction system for medical professionals. Doctors can input patient clinical data and/or upload MRI scans to receive AI-powered predictions with confidence scores and risk levels.

---

## Project Overview

OncoPredict AI combines two machine learning models into a single web application:

- **Clinical Model** — A Random Forest classifier trained on 9 patient parameters (age, tumor size, malignancy grade, etc.) to predict breast cancer recurrence
- **Image Model** — A MobileNetV2 CNN trained on MRI scans to detect cancer from images
- **Combined Model** — Uses Bayesian fusion to combine both models for a more robust prediction

The system is designed for doctors, not data scientists. A doctor logs in, fills in patient history, selects a prediction type, and gets a result with a confidence score and Low / Moderate / High risk level.

---

## AI & ML Pipeline

### Clinical Model Pipeline

```
Raw CSV Data
    ↓
Clean missing values ("?" symbols → NaN)
    ↓
Most-frequent imputation (SimpleImputer)
    ↓
Stratified train/validation split (80/20)
    ↓
OneHotEncoding of all categorical features
    ↓
Train Random Forest Classifier (100 trees, random_state=42)
    ↓
Evaluate: Accuracy, Precision, Recall, F1, Confusion Matrix
    ↓
Save: random_forest_model.joblib, encoder.joblib, imputer.joblib
```

The imputer and encoder are saved alongside the model because the API must apply the exact same transformations to live input data as were applied during training. Without them, predictions would fail.

### Image Model Pipeline

```
MRI Images (cancer / no_cancer folders)
    ↓
ImageDataGenerator — rescale + augmentation (flip, zoom, rotation)
    ↓
80/20 train/validation split
    ↓
MobileNetV2 base (pretrained on ImageNet, layers frozen)
    ↓
Custom head: Flatten → Dense(128, relu) → Dense(1, sigmoid)
    ↓
Train for 5 epochs with class weights (handles imbalance)
    ↓
Evaluate on held-out test_images/
    ↓
Save: image_model.h5
```

MobileNetV2 transfer learning is used because training a full CNN from scratch would require far more data and compute. The pretrained base already understands visual features; only the top layers are trained on medical images.

### Combined (Multimodal) Prediction

When both clinical data and an image are provided, the API applies Bayesian reliability-weighted fusion:

```
Clinical confidence (weight: 0.85) ──┐
                                      ├─→ Bayesian Fusion → Combined confidence %
Image confidence    (weight: 0.80) ──┘
```

If only one input is provided, that model's confidence is used directly.

---

## Project Structure

```
confidence_medical_ai-main/        ← Backend
├── src/
│   ├── api/
│   │   ├── main.py                ← FastAPI app, CORS, routers
│   │   ├── schema.py              ← Pydantic input validation
│   │   ├── clinical_routes.py     ← /predict-clinical endpoint
│   │   ├── image_routes.py        ← /predict-image endpoint
│   │   ├── multimodal_routes.py   ← /predict-multimodal endpoint
│   │   └── utils/                 ← prediction logic
│   ├── models/                    ← model loading and registry
│   ├── preprocessing/             ← imputer, encoder, pipeline
│   ├── training/                  ← train.py (generates .joblib files)
│   └── image_model/               ← CNN config, training, prediction
├── models/                        ← saved model files (generated)
├── data/
│   ├── processed/eda_checked.csv  ← cleaned dataset
│   └── images/                    ← MRI training images
├── requirements.txt
└── README.md

User_dashboard/                    ← Frontend
├── src/app/
│   ├── api.ts                     ← all fetch calls to backend
│   ├── pages/                     ← Login, Dashboard, Clinical, Image, Combined, Result, History
│   ├── context/AppContext.tsx      ← global auth + prediction state
│   └── components/                ← UI components + layout
└── package.json
```

---

## Setup

### Backend

```bash
cd confidence_medical_ai-main
py -3.10 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
pip install "numpy==1.26.4"
pip install "scikit-learn==1.4.2"
```

### Generate Clinical Model Files

```bash
python -m src.training.train
```

This trains the Random Forest and Logistic Regression models and saves all required files to `models/`:
- `random_forest_model.joblib`
- `logistic_model.joblib`
- `encoder.joblib`
- `imputer.joblib`

### Generate Image Model File

Organise your MRI images into this structure first:

```
data/
├── images/
│   ├── cancer/
│   └── no_cancer/
└── test_images/
    ├── cancer/
    └── no_cancer/
```

Then run:

```bash
python -m src.image_model.train_image_model
```

This saves `models/image_model.h5`.

### Start the Backend

```bash
uvicorn src.api.main:app --reload --port 8000
```

API runs at `http://localhost:8000` — interactive docs at `http://localhost:8000/docs`

---

### Frontend

```bash
cd User_dashboard
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## Running the Project

Every time you want to run the project, open two terminals:

**Terminal 1 — Backend:**
```bash
cd confidence_medical_ai-main
venv\Scripts\activate
uvicorn src.api.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd User_dashboard
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API status |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger UI |
| POST | `/predict-clinical` | Predict from clinical data |
| POST | `/predict-image` | Predict from MRI image |
| POST | `/predict-multimodal` | Predict from clinical data + image |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Tailwind CSS, Vite |
| Backend | FastAPI, Python 3.10, Uvicorn |
| Clinical Model | Random Forest — scikit-learn |
| Image Model | MobileNetV2 CNN — TensorFlow / Keras |
| Dataset | UCI Breast Cancer Dataset |