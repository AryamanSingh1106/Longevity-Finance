from collections import defaultdict

from engine.ml.ml_controller import run_behavior_ml
from engine.plaid_service import get_plaid_transactions
from engine.ml.lifestyle_model import detect_lifestyle_inflation


# ======================================
# BEHAVIOR ENGINE (REALISTIC VERSION)
# ======================================
def behavior_engine():

    # -------------------------------
    # FETCH TRANSACTIONS
    # -------------------------------
    try:
        transactions = get_plaid_transactions()
    except Exception as e:
        print("Plaid fetch error:", e)
        transactions = []

    # -------------------------------
    # CATEGORY TOTALS
    # -------------------------------
    category_totals = defaultdict(float)

    for t in transactions:
        category_totals[t["category"]] += t["amount"]

    categories = [
        {"name": k, "value": round(v, 2)}
        for k, v in category_totals.items()
    ]

    # -------------------------------
    # MONTHLY SPEND (TOTAL EXPENSES)
    # -------------------------------
    monthly_spend = round(
        sum(t["amount"] for t in transactions if t["amount"] > 0),
        2
    )

    # =====================================================
    # ⭐ REALISTIC INCOME ESTIMATION (SANDBOX FIX)
    # =====================================================
    # Plaid sandbox rarely gives real income data.
    # So we infer income from expenses.
    #
    # Assumption:
    # User saves roughly 15–25% of income.
    # -----------------------------------------------------
    if monthly_spend == 0:
        monthly_income = 0
    else:
        monthly_income = monthly_spend * 1.25

    monthly_expenses = monthly_spend

    # -------------------------------
    # SAVINGS RATE (REALISTIC)
    # -------------------------------
    if monthly_income == 0:
        savings_rate = 0
    else:
        savings_rate = round(
            ((monthly_income - monthly_expenses) / monthly_income) * 100,
            1
        )

    # -------------------------------
    # SPENDING SCORE (DYNAMIC)
    # -------------------------------
    if monthly_spend == 0:
        spending_score = 50
    elif monthly_spend < 1000:
        spending_score = 85
    elif monthly_spend < 3000:
        spending_score = 70
    elif monthly_spend < 6000:
        spending_score = 55
    else:
        spending_score = 40

    # -------------------------------
    # MONTHLY TREND (MULTI MONTH)
    # -------------------------------
    monthly_totals = defaultdict(float)

    for t in transactions:
        month = str(t["date"])[:7]  # YYYY-MM
        monthly_totals[month] += t["amount"]

    monthly_trend = [
        {"month": k, "value": round(v, 2)}
        for k, v in sorted(monthly_totals.items())
    ]

    # fallback if empty
    if not monthly_trend:
        monthly_trend = [{"month": "Current", "value": monthly_spend}]

    # -------------------------------
    # LIFESTYLE INFLATION MODEL
    # -------------------------------
    inflation_level, lifestyle_inflation = detect_lifestyle_inflation(
        monthly_trend
    )

    # -------------------------------
    # DEBUG (VERY IMPORTANT)
    # -------------------------------
    print("\n===== ML DEBUG =====")
    print("Transactions count:", len(transactions))
    print("Monthly spend:", monthly_spend)
    print("Estimated income:", monthly_income)
    print("Savings rate:", savings_rate)
    print("Spending score:", spending_score)
    print("Monthly trend:", monthly_trend)
    print("====================\n")

    # -------------------------------
    # RUN ML PIPELINE
    # -------------------------------
    ml_result = run_behavior_ml(
        monthly_spend,
        spending_score,
        monthly_trend
    )

    # -------------------------------
    # FINAL RESPONSE
    # -------------------------------
    return {
        "monthly_spend": monthly_spend,
        "savings_rate": savings_rate,
        "lifestyle_inflation": lifestyle_inflation,
        "anomalies_count": ml_result["anomalies_count"],
        "categories": categories,
        "monthly_trend": monthly_trend,
        "anomalies": ml_result["anomalies"],
        "risk_level": ml_result["risk_level"],
        "personality": ml_result["personality"],
    }