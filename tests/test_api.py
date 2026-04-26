import pytest
import time
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

VALID_PAYLOAD = {
    "age": "30-39",
    "menopause": "premeno",
    "tumor_size": "15-19",
    "inv_nodes": "0-2",
    "node_caps": "no",
    "deg_malig": "2",
    "breast": "left",
    "breast_quad": "left_low",
    "irradiat": "no"
}

HIGH_RISK_PAYLOAD = {
    "age": "50-59",
    "menopause": "ge40",
    "tumor_size": "20-24",
    "inv_nodes": "3-5",
    "node_caps": "yes",
    "deg_malig": "3",
    "breast": "right",
    "breast_quad": "right_up",
    "irradiat": "yes"
}


# Test 1: Home endpoint
def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert "running" in response.json()["message"].lower()


# Test 2: Valid clinical prediction returns expected keys
def test_valid_clinical_prediction():
    response = client.post("/predict-clinical", json=VALID_PAYLOAD)
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    assert "confidence" in data
    assert isinstance(data["confidence"], (int, float))
    # Confidence is 0-100 scale (e.g. 75.23), NOT 0-1
    assert 0.0 <= data["confidence"] <= 100.0


# Test 3: Missing required fields returns 422
def test_missing_field():
    response = client.post("/predict-clinical", json={"age": "30-39"})
    assert response.status_code == 422


# Test 4: Invalid field value returns 422
def test_invalid_age():
    payload = {**VALID_PAYLOAD, "age": "not_valid"}
    response = client.post("/predict-clinical", json=payload)
    assert response.status_code == 422


# Test 5: Response time under 1 second
def test_response_time():
    start = time.time()
    response = client.post("/predict-clinical", json=HIGH_RISK_PAYLOAD)
    elapsed = time.time() - start
    assert response.status_code == 200
    assert elapsed < 1.0


# Test 6: Prediction label is one of the two valid values
def test_prediction_label():
    response = client.post("/predict-clinical", json=VALID_PAYLOAD)
    data = response.json()
    assert data["prediction"] in ["No Recurrence", "Recurrence Risk"]


# Test 7: Explanation endpoint returns explanation and risk_level
def test_clinical_with_explanation():
    response = client.post("/predict-clinical-with-explanation", json=VALID_PAYLOAD)
    assert response.status_code == 200
    data = response.json()
    assert "explanation" in data
    assert "risk_level" in data
    assert data["risk_level"] in ["Low Risk", "Moderate Risk", "High Risk"]


# Test 8: Batch prediction with 2 patients
def test_batch_prediction():
    response = client.post("/predict-batch", json=[VALID_PAYLOAD, HIGH_RISK_PAYLOAD])
    assert response.status_code == 200
    data = response.json()
    assert data["total_patients"] == 2
    assert data["successful_predictions"] == 2
    assert len(data["predictions"]) == 2


# Test 9: Multimodal with no input returns 400
def test_multimodal_no_input():
    response = client.post("/predict-multimodal")
    assert response.status_code == 400


# Test 10: /models endpoint returns list
def test_models_endpoint():
    response = client.get("/models")
    assert response.status_code == 200
    assert "available_models" in response.json()


if __name__ == "__main__":
    pytest.main([__file__, "-v"])