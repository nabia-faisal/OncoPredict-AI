import joblib
import os

from src.preprocessing.pipeline import prepare_data
from src.models.baseline_model import create_baseline_model, train_model
from src.models.random_forest_model import create_random_forest_model, train_random_forest
from src.evaluation.metrics import evaluate_model
from src.analysis.error_analysis import analyze_errors
from src.models.load_model import load_logistic_model


# =========================
# STEP 1: LOAD + PREPROCESS
# =========================

X_train, X_val, y_train, y_val, imputer, encoder = prepare_data(
    filepath="data/processed/eda_checked.csv",
    target_column="Class"
)


# =========================
# STEP 2: CREATE MODELS
# =========================

model = create_baseline_model()
rf_model = create_random_forest_model()


# =========================
# STEP 3: TRAIN MODELS
# =========================

model = train_model(model, X_train, y_train)
rf_model = train_random_forest(rf_model, X_train, y_train)


# =========================
# STEP 4: SAVE EVERYTHING
# =========================

os.makedirs("models", exist_ok=True)

# Save models
joblib.dump(model, "models/logistic_model.joblib")
joblib.dump(rf_model, "models/random_forest_model.joblib")

# 🔥 NEW (CRITICAL FIX)
joblib.dump(imputer, "models/imputer.joblib")
joblib.dump(encoder, "models/encoder.joblib")

print("\nModels + preprocessing components saved successfully!")


# =========================
# STEP 5: VERIFY SERIALIZATION
# =========================

loaded_model = load_logistic_model()

original_preds = model.predict(X_val)
loaded_preds = loaded_model.predict(X_val)

assert (original_preds == loaded_preds).all(), \
    "Loaded model predictions do not match original model!"

print("\nModel serialization verified successfully!")


# =========================
# STEP 6: EVALUATION
# =========================

# Logistic Regression
lr_accuracy, lr_report, lr_matrix = evaluate_model(model, X_val, y_val)

print("\nLogistic Regression Results:")
print("Accuracy:", lr_accuracy)
print(lr_report)
print("Confusion Matrix:\n", lr_matrix)

# Random Forest
rf_accuracy, rf_report, rf_matrix = evaluate_model(rf_model, X_val, y_val)

print("\nRandom Forest Results:")
print("Accuracy:", rf_accuracy)
print(rf_report)
print("Confusion Matrix:\n", rf_matrix)
# =========================
# STEP 7: ERROR ANALYSIS
# =========================

print("\nLogistic Regression Error Analysis:")
lr_errors = analyze_errors(model, X_val, y_val)

print("\nRandom Forest Error Analysis:")
rf_errors = analyze_errors(rf_model, X_val, y_val)