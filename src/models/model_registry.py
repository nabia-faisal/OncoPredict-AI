from dataclasses import dataclass
from typing import Optional, List


@dataclass
class ModelMetadata:
    name: str
    version: str
    accuracy: float
    f1_score: float
    created_date: str
    description: str

    def to_dict(self):
        return {
            "name": self.name,
            "version": self.version,
            "accuracy": self.accuracy,
            "f1_score": self.f1_score,
            "created_date": self.created_date,
            "description": self.description
        }


class ModelRegistry:
    """Track model versions and metadata"""

    def __init__(self):
        self.models = {}
        self.metadata = {}

    def register_model(self, name: str, model, metadata: ModelMetadata):
        version_key = f"{name}:v{metadata.version}"
        self.models[version_key] = model
        self.metadata[version_key] = metadata

    def get_model(self, name: str, version: Optional[str] = None):
        if version:
            key = f"{name}:v{version}"
            return self.models.get(key)
        else:
            keys = [k for k in self.models.keys() if k.startswith(name)]
            return self.models.get(keys[-1]) if keys else None

    def list_models(self) -> List[dict]:
        return [meta.to_dict() for meta in self.metadata.values()]


# Single shared instance — imported by clinical_utils and main.py
registry = ModelRegistry()