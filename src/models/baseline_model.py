from sklearn.linear_model import LogisticRegression
from src.config import LOGISTIC_PARAMS

def create_baseline_model():
    
    model = LogisticRegression(**LOGISTIC_PARAMS)
    
    return model

def train_model(model, X_train, y_train):
    
    model.fit(X_train, y_train)
    
    return model

def predict(model, X):
    
    return model.predict(X)


def predict_proba(model, X):
    
    return model.predict_proba(X)
