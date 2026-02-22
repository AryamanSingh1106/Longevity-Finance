# backend/engine/ml/risk_model.py

import os
import joblib
import numpy as np

# -----------------------------
# LOAD TRAINED MODEL
# -----------------------------
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "risk_model.pkl")

model = None

try:
    model = joblib.load(MODEL_PATH)
    print("✅ ML Risk Model Loaded")
except Exception as e:
    print("❌ Could not load ML model:", e)


# -----------------------------
# REAL ML PREDICTION
# -----------------------------
def predict_risk_ml(savings_rate, monthly_spend):
    """
    REAL ML prediction using trained RandomForest model
    """

    # fallback safety
    if model is None:
        print("⚠ Using fallback rule logic")
        if savings_rate < 15 or monthly_spend > 5500:
            return "at-risk"
        elif savings_rate < 25:
            return "moderate"
        else:
            return "secure"

    # ML expects:
    # [monthly_savings, spending_score]
    features = np.array([[monthly_spend, savings_rate]])

    prediction = model.predict(features)[0]

    return prediction