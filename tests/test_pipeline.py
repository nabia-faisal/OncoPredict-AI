import os
import joblib

def test_model_files_exist():
    # Check that model files were created
    assert os.path.exists("models/logistic_model.joblib")
    assert os.path.exists("models/random_forest_model.joblib")

def test_models_can_be_loaded():
    # Load the models to ensure they are not corrupted
    logistic = joblib.load("models/logistic_model.joblib")
    rf = joblib.load("models/random_forest_model.joblib")
    
    assert logistic is not None
    assert rf is not None