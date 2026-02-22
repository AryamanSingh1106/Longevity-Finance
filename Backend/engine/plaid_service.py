from datetime import date, timedelta, datetime
import random
import hashlib
import engine.session as session

from engine.plaid_client import client
from plaid.model.transactions_get_request import TransactionsGetRequest


# -------------------------------
# SIMPLE MEMORY CACHE
# -------------------------------
CACHE_TRANSACTIONS = None
CACHE_TIME = None
CACHE_DURATION = 30   # seconds


# -----------------------------------
# CATEGORY MAP (UI categories)
# -----------------------------------
CATEGORY_MAP = {
    "FOOD_AND_DRINK": "Food",
    "TRANSPORTATION": "Transport",
    "TRAVEL": "Transport",
    "GENERAL_MERCHANDISE": "Shopping",
    "GENERAL_SERVICES": "Shopping",
    "LOAN_PAYMENTS": "Housing",
    "RENT_AND_UTILITIES": "Housing",
    "TRANSFER_OUT": "Housing",
    "PERSONAL_CARE": "Lifestyle",
    "ENTERTAINMENT": "Lifestyle",
}

ALLOWED_CATEGORIES = [
    "Housing",
    "Food",
    "Transport",
    "Shopping",
    "Lifestyle",
]


# -----------------------------------
# GLOBAL DEMO SCALING
# -----------------------------------
DEMO_SCALE_FACTOR = 0.35


# -----------------------------------
# 🔥 STABLE REALISM ENGINE
# -----------------------------------
def add_behavior_realism(cleaned):
    """
    Adds realistic financial variation
    WITHOUT changing results every refresh.
    Works for BOTH income and expenses.
    """

    if not cleaned:
        return cleaned

    enhanced = []

    for t in cleaned:

        new_t = t.copy()

        # deterministic randomness
        seed = hashlib.md5(
            f"{t['date']}-{t['receiver']}-{t['amount']}".encode()
        ).hexdigest()

        random.seed(seed)

        amount = new_t["amount"]
        category = new_t["category"]

        # -------------------------
        # CATEGORY BASED VARIANCE
        # -------------------------
        if category == "Housing":
            variance = random.uniform(0.97, 1.03)
        elif category == "Food":
            variance = random.uniform(0.90, 1.12)
        elif category == "Transport":
            variance = random.uniform(0.92, 1.10)
        else:
            variance = random.uniform(0.88, 1.15)

        # preserve sign (income stays negative)
        scaled = amount * variance * DEMO_SCALE_FACTOR

        # prevent tiny values while keeping sign
        if scaled > 0:
            scaled = max(1, scaled)
        else:
            scaled = min(-1, scaled)

        new_t["amount"] = round(scaled, 2)

        enhanced.append(new_t)

        # -------------------------
        # IMPULSE MICRO SPEND
        # -------------------------
        if amount > 0 and random.random() < 0.08:
            enhanced.append({
                "date": new_t["date"],
                "receiver": "Impulse Purchase",
                "amount": round(random.uniform(8, 40), 2),
                "category": random.choice(
                    ["Food", "Shopping", "Lifestyle"]
                ),
            })

        # -------------------------
        # RARE SHOCK EXPENSE
        # -------------------------
        if amount > 0 and random.random() < 0.02:
            enhanced.append({
                "date": new_t["date"],
                "receiver": "Unexpected Expense",
                "amount": round(random.uniform(120, 600), 2),
                "category": "Lifestyle",
            })

    return enhanced


# -----------------------------------
# MAIN FUNCTION
# -----------------------------------
def get_plaid_transactions():

    global CACHE_TRANSACTIONS, CACHE_TIME

    # -------------------------------
    # CACHE CHECK
    # -------------------------------
    if CACHE_TRANSACTIONS and CACHE_TIME:
        elapsed = (datetime.now() - CACHE_TIME).seconds
        if elapsed < CACHE_DURATION:
            print("⚡ Using cached Plaid data")
            return CACHE_TRANSACTIONS

    # -------------------------------
    # ACCESS TOKEN CHECK
    # -------------------------------
    if not hasattr(session, "SAVED_ACCESS_TOKEN") or not session.SAVED_ACCESS_TOKEN:
        print("No Plaid access token found")
        return []

    try:

        today = date.today()
        start_date = today - timedelta(days=90)

        request = TransactionsGetRequest(
            access_token=session.SAVED_ACCESS_TOKEN,
            start_date=start_date,
            end_date=today,
        )

        response = client.transactions_get(request)
        transactions = response.to_dict()["transactions"]

    except Exception as e:
        print("Plaid fetch error:", e)
        return []

    cleaned = []

    # -------------------------------
    # CLEAN + FILTER
    # KEEP BOTH income + expenses
    # -------------------------------
    for t in transactions:

        amount = t["amount"]

        plaid_category = (
            t["personal_finance_category"]["primary"]
            if t.get("personal_finance_category")
            else None
        )

        ui_category = CATEGORY_MAP.get(plaid_category)

        if ui_category not in ALLOWED_CATEGORIES:
            continue

        merchant = t.get("merchant_name") or t.get("name")

        cleaned.append(
            {
                "date": str(t["date"]),
                "receiver": merchant,
                "amount": round(amount, 2),  # KEEP SIGN
                "category": ui_category,
            }
        )

    # -------------------------------
    # APPLY REALISM ENGINE
    # -------------------------------
    cleaned = add_behavior_realism(cleaned)

    # -------------------------------
    # SORT NEWEST FIRST
    # -------------------------------
    cleaned.sort(key=lambda x: x["date"], reverse=True)

    # -------------------------------
    # SAVE CACHE
    # -------------------------------
    CACHE_TRANSACTIONS = cleaned
    CACHE_TIME = datetime.now()

    print(f"Plaid transactions fetched: {len(cleaned)}")

    return cleaned