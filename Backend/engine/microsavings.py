from datetime import datetime
import math

from engine.plaid_service import get_plaid_transactions


# ======================================
# MICRO SAVINGS ENGINE (REAL VERSION)
# ======================================
def microsavings_engine():

    try:
        transactions = get_plaid_transactions()
    except Exception as e:
        print("Plaid fetch error:", e)
        transactions = []

    roundups = []
    total_saved = 0

    # ----------------------------------
    # CALCULATE ROUNDUPS (FIXED)
    # ----------------------------------
    for t in transactions:

        amount = float(t["amount"])

        # expenses only
        if amount <= 0:
            continue

        # proper roundup calculation
        roundup = round(math.ceil(amount) - amount, 2)

        # avoid 0.00 values (UI issue)
        if roundup == 0:
            roundup = 0.01

        # safety filter
        if roundup < 0 or roundup > 1:
            continue

        total_saved += roundup

        roundups.append({
            "date": t["date"],
            "merchant": t["receiver"],
            "amount": round(amount, 2),
            "roundup": roundup
        })

    # newest first
    roundups.sort(key=lambda x: x["date"], reverse=True)

    # recent list (UI)
    recent_roundups = roundups[:8]

    # ----------------------------------
    # SIMPLE PROJECTION
    # ----------------------------------
    monthly_auto = round(total_saved * 4, 2)

    projection = []
    base = monthly_auto * 12

    for year in range(2026, 2041):
        growth = base * (1 + 0.07 * (year - 2026))
        projection.append({
            "year": year,
            "value": round(growth, 2)
        })

    # ----------------------------------
    # FINAL RESPONSE
    # ----------------------------------
    return {
        "total_saved": round(total_saved, 2),
        "roundups_today": round(total_saved, 2),
        "monthly_auto": monthly_auto,
        "projected_15yr": round(base * 15 * 1.08, 2),
        "projection": projection,
        "recent_roundups": recent_roundups
    }