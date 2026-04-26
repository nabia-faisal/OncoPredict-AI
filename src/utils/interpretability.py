# Add to: src/utils/interpretability.py

import numpy as np
from sklearn.preprocessing import OneHotEncoder

def get_feature_importance(model, feature_names, top_n=5):
    """
    Get top N most important features for the model
    """
    if hasattr(model, 'feature_importances_'):  # Random Forest
        importances = model.feature_importances_
        indices = np.argsort(importances)[-top_n:][::-1]
        
        top_features = [
            {
                "feature": feature_names[i],
                "importance": float(importances[i]),
                "percentage": float(importances[i] * 100)
            }
            for i in indices
        ]
        return top_features
    return []

def interpret_clinical_prediction(prediction, confidence, feature_importance):
    """
    Create human-readable interpretation
    """
    if confidence < 0.5:
        confidence_level = "Low (uncertain)"
    elif confidence < 0.7:
        confidence_level = "Moderate"
    else:
        confidence_level = "High (very confident)"
    
    top_factors = feature_importance[:3]
    
    return {
        "prediction": prediction,
        "confidence_level": confidence_level,
        "confidence_score": float(confidence),
        "interpretation": f"The model predicts {prediction} with {confidence_level} confidence",
        "top_influencing_factors": top_factors,
        "medical_insight": generate_medical_insight(prediction, confidence, top_factors)
    }

def generate_medical_insight(prediction, confidence, factors):
    """
    Generate medical insights based on prediction
    """
    if prediction == "recurrence-events":
        if confidence > 0.7:
            return "High risk of cancer recurrence detected. Recommend close follow-up."
        elif confidence > 0.5:
            return "Moderate risk detected. Consider additional testing."
        else:
            return "Uncertain prediction. Further clinical evaluation recommended."
    else:
        if confidence > 0.8:
            return "Low risk of recurrence. Standard follow-up protocol recommended."
        else:
            return "Prediction suggests no recurrence, but close monitoring advised."