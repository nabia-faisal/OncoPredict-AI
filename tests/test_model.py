import numpy as np
from src.models.load_model import load_logistic_model

def test_logistic_model_load():
    model = load_logistic_model()
    assert model is not None

def test_logistic_model_prediction_shape():
    model = load_logistic_model()
    
    # Create dummy input (must match feature size)
    sample_input = np.zeros((1, model.n_features_in_))
    
    prediction = model.predict(sample_input)
    
    assert prediction.shape == (1,)