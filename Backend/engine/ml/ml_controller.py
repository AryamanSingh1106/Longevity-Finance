from engine.ml.risk_model import predict_risk_ml
from engine.ml.personality_model import detect_personality_ml
from engine.ml.anomaly_model import detect_spending_anomalies_ml


# ======================================
# MAIN ML PIPELINE
# ======================================

def run_behavior_ml(monthly_spend, spending_score, monthly_trend):

    risk = predict_risk_ml(monthly_spend, spending_score)

    personality = detect_personality_ml(spending_score)

    anomalies, anomalies_count = detect_spending_anomalies_ml(monthly_trend)

    return {
        "risk_level": risk,
        "personality": personality,
        "anomalies": anomalies,
        "anomalies_count": anomalies_count,
    }