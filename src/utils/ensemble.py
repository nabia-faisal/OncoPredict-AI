import numpy as np


class AdvancedEnsemble:
    """Advanced ensemble methods for combining model predictions"""

    @staticmethod
    def bayesian_fusion(clinical_conf: float, image_conf: float,
                        clinical_reliability: float = 0.85,
                        image_reliability: float = 0.80) -> float:
        """
        Weighted fusion based on known model reliability.
        clinical_conf and image_conf should both be on the same scale (0-1).
        Returns fused confidence as 0-1.
        """
        total = clinical_reliability + image_reliability
        clinical_weight = clinical_reliability / total
        image_weight = image_reliability / total
        return float(clinical_conf * clinical_weight + image_conf * image_weight)

    @staticmethod
    def agreement_based_fusion(clinical_conf: float, image_conf: float) -> float:
        """
        Boost confidence when models agree, penalise when they disagree.
        Both inputs should be 0-1. Returns 0-1.
        """
        if abs(clinical_conf - image_conf) < 0.2:
            # Models agree — boost slightly
            return min(max(clinical_conf, image_conf) + 0.05, 1.0)
        else:
            # Models disagree — average with a small penalty
            return max((clinical_conf + image_conf) / 2 - 0.1, 0.0)

    @staticmethod
    def voting_ensemble(clinical_pred: str, image_pred: str,
                        clinical_conf: float, image_conf: float) -> str:
        """
        Return the prediction from whichever model is more confident.
        Defaults to clinical on a tie.
        """
        if image_conf > clinical_conf:
            return image_pred
        return clinical_pred


# Single shared instance — import this wherever needed
ensemble = AdvancedEnsemble()