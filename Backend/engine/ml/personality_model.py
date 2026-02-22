# backend/engine/ml/personality_model.py

def detect_personality_ml(monthly_spend):

    if monthly_spend > 5500:
        return "Impulse Spender"

    elif monthly_spend > 4500:
        return "Balanced Investor"

    else:
        return "Disciplined Saver"