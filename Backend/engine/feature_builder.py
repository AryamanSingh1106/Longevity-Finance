# backend/engine/feature_builder.py

def build_features(behavior):
    """
    Converts behavior engine output into ML-ready features.
    This is the bridge between database -> ML.
    """

    monthly_spend = behavior["monthly_spend"]
    savings_rate = behavior["savings_rate"]

    return {
        "monthly_spend": monthly_spend,
        "savings_rate": savings_rate,
    }