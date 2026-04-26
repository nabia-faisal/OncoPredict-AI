import shap
import numpy as np


class SHAPExplainer:
    """Use SHAP values to explain individual predictions from the Random Forest."""

    def __init__(self, model, feature_names: list):
        """
        Args:
            model: trained sklearn Random Forest
            feature_names: list of feature name strings (from encoder.get_feature_names_out())
        """
        self.explainer = shap.TreeExplainer(model)
        self.feature_names = feature_names

    def explain_prediction(self, X_instance) -> dict:
        """
        Get SHAP values for a single prediction.
        X_instance should be a 2D array/DataFrame with shape (1, n_features).
        """
        shap_values = self.explainer.shap_values(X_instance)

        # For binary classification sklearn returns a list of two arrays
        # Index 1 = class "recurrence" (positive class)
        if isinstance(shap_values, list):
            shap_vals = shap_values[1][0]
        else:
            shap_vals = shap_values[0]

        feature_importance = []
        for feature, shap_val in zip(self.feature_names, shap_vals):
            feature_importance.append({
                "feature": feature,
                "shap_value": round(float(shap_val), 4),
                "impact": "increases risk" if shap_val > 0 else "decreases risk"
            })

        # Sort by absolute impact — most influential features first
        feature_importance.sort(key=lambda x: abs(x["shap_value"]), reverse=True)

        return {
            "top_features": feature_importance[:5],
            "all_features": feature_importance
        }


# Single shared instance — lazy-initialised in clinical_routes if needed
# Usage:
#   from src.utils.shap_explainer import SHAPExplainer
#   explainer = SHAPExplainer(model, feature_names)
#   result = explainer.explain_prediction(X_encoded)