# src/config.py

# =========================
# Experiment Configuration
# =========================

RANDOM_SEED = 42
TEST_SIZE = 0.2

# Logistic Regression parameters
LOGISTIC_PARAMS = {
    "max_iter": 1000,
    "random_state": RANDOM_SEED
}

# Random Forest parameters
RANDOM_FOREST_PARAMS = {
    "n_estimators": 100,
    "random_state": RANDOM_SEED
}