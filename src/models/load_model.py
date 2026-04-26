import joblib

def load_logistic_model():
    return joblib.load("models/logistic_model.joblib")

def load_random_forest_model():
    return joblib.load("models/random_forest_model.joblib")