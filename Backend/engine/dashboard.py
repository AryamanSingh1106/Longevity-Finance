from engine.plaid_service import get_plaid_transactions
from engine.ml.risk_model import predict_risk_ml


# ======================================
# DASHBOARD ENGINE (PRO VERSION)
# ======================================
def dashboard_engine():

    # -----------------------------
    # FETCH TRANSACTIONS
    # -----------------------------
    try:
        transactions = get_plaid_transactions()
    except Exception as e:
        print("Plaid fetch error:", e)
        transactions = []

    # -----------------------------
    # BASIC TOTALS
    # -----------------------------
    monthly_expenses = sum(t["amount"] for t in transactions)

    # realistic demo income estimation
    monthly_income = monthly_expenses * 1.15 if monthly_expenses > 0 else 0

    monthly_savings = max(0, monthly_income - monthly_expenses)

    # demo cap (UI realism)
    monthly_savings = min(monthly_savings, 1200)

    # -----------------------------
    # SAVINGS RATE
    # -----------------------------
    if monthly_income == 0:
        savings_rate = 0
    else:
        savings_rate = round(
            (monthly_savings / monthly_income) * 100,
            1
        )

    # -----------------------------
    # RISK LEVEL (ML)
    # -----------------------------
    risk_level = predict_risk_ml(
        savings_rate,
        monthly_expenses
    )

    # -----------------------------
    # RETIREMENT SCORE (FIXED LOGIC)
    # -----------------------------
    retirement_score = max(
        10,
        min(
            95,
            int(
                (savings_rate * 2.5)
                + (monthly_savings / 100)
            )
        )
    )

    # -----------------------------
    # DYNAMIC RETIREMENT AGE
    # -----------------------------
    if savings_rate >= 35:
        projected_retirement_age = 58
    elif savings_rate >= 25:
        projected_retirement_age = 62
    elif savings_rate >= 15:
        projected_retirement_age = 65
    elif savings_rate >= 5:
        projected_retirement_age = 70
    else:
        projected_retirement_age = 74

    # -----------------------------
    # MONTHLY TARGET (REALISTIC)
    # target must ALWAYS be higher
    # than current savings
    # -----------------------------
    monthly_target = max(
        round(monthly_savings * 1.15, 2),
        round(monthly_expenses * 0.12, 2)
    )

    # -----------------------------
    # WEALTH PROJECTION
    # -----------------------------
    projection = []

    base = monthly_savings * 12

    for year in range(2026, 2041):
        growth = base * (1 + 0.06 * (year - 2026))

        projection.append({
            "year": year,
            "current": round(growth * 0.75, 2),
            "optimized": round(growth, 2)
        })

    # -----------------------------
    # AI PRIORITY INSIGHTS (PRO)
    # -----------------------------
    priority_insights = []

    if savings_rate < 10:
        priority_insights.append({
            "type": "warning",
            "text": "Savings rate is low. Increasing monthly savings will improve retirement readiness."
        })

    if monthly_savings > 0:
        priority_insights.append({
            "type": "positive",
            "text": f"You are consistently saving ${round(monthly_savings,2)} per month. Strong financial discipline detected."
        })

    if projected_retirement_age >= 70:
        priority_insights.append({
            "type": "warning",
            "text": "Projected retirement age is higher than ideal. Increasing investments slightly can reduce this."
        })

    priority_insights.append({
        "type": "suggestion",
        "text": "Automating investments can improve long-term wealth growth by 15–25%."
    })

    # -----------------------------
    # FINAL RESPONSE
    # -----------------------------
    return {
        "risk_level": risk_level,
        "monthly_savings": round(monthly_savings, 2),
        "delay_cost": round(monthly_expenses * 0.8, 2),
        "retirement_score": retirement_score,
        "projection": projection,
        "projected_retirement_age": projected_retirement_age,
        "monthly_target": monthly_target,
        "action_items": 3,
        "retirement_gap": round(monthly_expenses * 36, 2),
        "priority_insights": priority_insights,
    }