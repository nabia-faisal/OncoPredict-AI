import pandas as pd


def analyze_errors(model, X_val, y_val):
    
    # Get predictions
    y_pred = model.predict(X_val)
    
    # Create comparison dataframe
    results = pd.DataFrame({
        "Actual": y_val,
        "Predicted": y_pred
    })
    
    # Find wrong predictions
    errors = results[results["Actual"] != results["Predicted"]]
    
    print("\nTotal validation samples:", len(results))
    print("Total errors:", len(errors))
    
    print("\nError samples:")
    print(errors.head(10))
    
    return errors