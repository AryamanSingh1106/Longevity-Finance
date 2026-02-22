# backend/engine/ml/retrain.py

import os
import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split


# -----------------------------
# FIXED PATHS (IMPORTANT)
# -----------------------------
BASE_DIR = os.path.dirname(__file__)

dataset_path = os.path.join(BASE_DIR, "dataset.csv")
model_path = os.path.join(BASE_DIR, "risk_model.pkl")


# -----------------------------
# LOAD DATA
# -----------------------------
df = pd.read_csv(dataset_path)

X = df[["monthly_savings", "spending_score"]]
y = df["risk_level"]


# -----------------------------
# TRAIN MODEL
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)


# -----------------------------
# SAVE MODEL
# -----------------------------
joblib.dump(model, model_path)

print("✅ Model saved at:", model_path)