from sklearn.ensemble import RandomForestClassifier
from src.config import RANDOM_FOREST_PARAMS

def create_random_forest_model():
    
    model = RandomForestClassifier(**RANDOM_FOREST_PARAMS)
    
    return model


def train_random_forest(model, X_train, y_train):
    
    model.fit(X_train, y_train)
    
    return model