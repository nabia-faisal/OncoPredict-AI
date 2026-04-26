# src/preprocessing/encoding.py

from sklearn.preprocessing import OneHotEncoder

def encode_categorical(X_train, X_val):
    encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=False)

    X_train_encoded = encoder.fit_transform(X_train)
    X_val_encoded = encoder.transform(X_val)

    return X_train_encoded, X_val_encoded, encoder
