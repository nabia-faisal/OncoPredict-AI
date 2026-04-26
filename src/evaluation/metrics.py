from sklearn.metrics import accuracy_score, classification_report, confusion_matrix


def evaluate_model(model, X_val, y_val):
    
    # Get predictions
    y_pred = model.predict(X_val)
    
    # Calculate accuracy
    accuracy = accuracy_score(y_val, y_pred)
    
    # Generate classification report
    report = classification_report(y_val, y_pred)
    
    # Generate confusion matrix
    matrix = confusion_matrix(y_val, y_pred)
    
    return accuracy, report, matrix