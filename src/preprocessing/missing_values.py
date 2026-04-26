# src/preprocessing/missing_values.py

import pandas as pd
from sklearn.impute import SimpleImputer

def clean_missing_symbols(df):
    df = df.replace("?", pd.NA)
    return df

def impute_categorical(X_train, X_val):
    imputer = SimpleImputer(strategy="most_frequent")

    X_train_imputed = imputer.fit_transform(X_train)
    X_val_imputed = imputer.transform(X_val)

    return X_train_imputed, X_val_imputed, imputer
