import sys
sys.path.append(r"F:\Lab1_503565_AbihaKhan1\src")

from preprocessing.pipeline import prepare_data


X_train, X_val, y_train, y_val = prepare_data(
    filepath="data/processed/eda_checked.csv",
    target_column="Class"  # adjust based on dataset
)

print("Train shape:", X_train.shape)
print("Validation shape:", X_val.shape)
print("Train labels distribution:\n", y_train.value_counts())
print("Validation labels distribution:\n", y_val.value_counts())
