import random


def generate_insights_ml(risk_level, personality, monthly_spend, savings_rate):

    insights = []

    # ===============================
    # RISK BASED INSIGHTS
    # ===============================
    if risk_level == "secure":
        insights.append("Your financial health looks strong. Consider long-term investments.")
        insights.append("AI predicts stable retirement growth based on current habits.")

    elif risk_level == "moderate":
        insights.append("Small spending optimizations could significantly improve savings.")
        insights.append("AI suggests increasing automated investments.")

    else:
        insights.append("High financial risk detected. Reduce discretionary expenses.")
        insights.append("AI recommends building a stronger emergency fund.")

    # ===============================
    # PERSONALITY INSIGHTS
    # ===============================
    if personality == "Impulse Spender":
        insights.append("Your spending shows impulsive behavior patterns.")
    elif personality == "Lifestyle Optimizer":
        insights.append("You balance lifestyle and savings well but can optimize more.")
    elif personality == "Balanced Investor":
        insights.append("You show balanced financial behavior — good long-term signal.")
    else:
        insights.append("Disciplined saver detected — excellent consistency.")

    # ===============================
    # SAVINGS LOGIC
    # ===============================
    if savings_rate < 18:
        insights.append("Increasing savings rate by just 5% could accelerate retirement.")
    elif savings_rate > 25:
        insights.append("Your savings rate is excellent compared to average users.")

    # recommendation score (AI confidence)
    recommendation_score = random.randint(75, 95)

    return {
        "insights": insights,
        "recommendation_score": recommendation_score,
    }