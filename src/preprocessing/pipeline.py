# src/preprocessing/pipeline.py

import pandas as pd
from sklearn.model_selection import train_test_split

from src.preprocessing.missing_values import clean_missing_symbols, impute_categorical
from src.preprocessing.encoding import encode_categorical
from src.config import RANDOM_SEED, TEST_SIZE


def prepare_data(filepath, target_column, test_size=TEST_SIZE, random_state=RANDOM_SEED):    
    # Load dataset
    df = pd.read_csv(filepath)

    # Clean missing symbols
    df = clean_missing_symbols(df)

    # Separate features and target
    X = df.drop(columns=[target_column])
    y = df[target_column]

    # Stratified split (important for medical imbalance)
    X_train, X_val, y_train, y_val = train_test_split(
        X, y,
        test_size=test_size,
        random_state=random_state,
        stratify=y
    )

    # =========================
    # IMPUTATION
    # =========================
    X_train_imp, X_val_imp, imputer = impute_categorical(X_train, X_val)

    # =========================
    # ENCODING
    # =========================
    X_train_enc, X_val_enc, encoder = encode_categorical(
        X_train_imp,
        X_val_imp
    )

    # =========================
    # RETURN EVERYTHING (IMPORTANT FIX)
    # =========================
    return X_train_enc, X_val_enc, y_train, y_val, imputer, encoder