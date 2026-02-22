import random


def enhance_transactions(transactions):
    """
    Enhances Plaid sandbox data with realistic income and expense dynamics.
    Keeps schema intact.
    """

    enhanced = []

    for t in transactions:
        new_t = t.copy()
        amount = new_t.get("amount", 0)
        category = new_t.get("category")

        # -------------------------
        # INCOME ENHANCEMENT
        # -------------------------
        if amount < 0:

            # Payroll variability ±3%
            variance = random.uniform(0.97, 1.03)
            new_t["amount"] = round(amount * variance, 2)

            # 8% chance of bonus
            if random.random() < 0.08:
                enhanced.append({
                    "date": new_t["date"],
                    "receiver": "Bonus Credit",
                    "amount": round(abs(amount) * 0.20, 2),
                    "category": "Lifestyle"
                })

        # -------------------------
        # EXPENSE ENHANCEMENT
        # -------------------------
        if amount > 0:

            # Fixed expenses (like Housing) → low variance
            if category == "Housing":
                variance = random.uniform(0.98, 1.02)

            # Variable expenses → higher variance
            else:
                variance = random.uniform(0.90, 1.10)

            new_t["amount"] = round(amount * variance, 2)

            # 15% impulse micro spend
            if random.random() < 0.15:
                enhanced.append({
                    "date": new_t["date"],
                    "receiver": "Impulse Purchase",
                    "amount": round(random.uniform(10, 75), 2),
                    "category": random.choice(
                        ["Food", "Shopping", "Lifestyle"]
                    )
                })

            # 3% rare shock expense
            if random.random() < 0.03:
                enhanced.append({
                    "date": new_t["date"],
                    "receiver": "Unexpected Expense",
                    "amount": round(random.uniform(300, 1200), 2),
                    "category": "Lifestyle"
                })

        enhanced.append(new_t)

    return enhanced