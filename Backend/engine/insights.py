# backend/engine/insights.py

from engine.behavior import behavior_engine


# ======================================
# SAFE ADD (NO DUPLICATES)
# ======================================
def add_unique(lst, text):
    """Add insight only if not already present."""
    if text not in lst:
        lst.append(text)


# ======================================
# INSIGHTS ENGINE (REAL DATA)
# ======================================
def insights_engine():

    # get behavior analysis (already ML powered)
    behavior = behavior_engine()

    insights = []
    behavioral_signals = []
    optimization = []

    # -----------------------------
    # RISK BASED INSIGHTS
    # -----------------------------
    if behavior["risk_level"] == "at-risk":
        add_unique(
            insights,
            "Your spending pattern indicates elevated financial risk.",
        )

        add_unique(
            behavioral_signals,
            "High expense ratio detected relative to savings.",
        )

    elif behavior["risk_level"] == "moderate":
        add_unique(
            insights,
            "Your finances are stable but could improve with better savings discipline.",
        )

    else:
        add_unique(
            insights,
            "Your savings behavior indicates strong long-term financial stability.",
        )

        add_unique(
            optimization,
            "You are in a strong financial zone — consider investing surplus.",
        )

    # -----------------------------
    # LIFESTYLE INFLATION
    # -----------------------------
    if behavior["lifestyle_inflation"] > 15:
        msg = (
            f"Lifestyle inflation detected. Spending increased by "
            f"{behavior['lifestyle_inflation']}% over recent months."
        )

        # ONLY add once → AI insights
        add_unique(insights, msg)

        # Separate wording for signals (no duplicates)
        add_unique(
            behavioral_signals,
            "Lifestyle inflation trend detected in spending behavior.",
        )

    # -----------------------------
    # ANOMALIES
    # -----------------------------
    if behavior["anomalies_count"] > 0:
        add_unique(
            insights,
            "Impulse spending patterns detected. Consider spending limits.",
        )

        add_unique(
            behavioral_signals,
            "Spending spikes detected in recent months.",
        )
    else:
        add_unique(
            optimization,
            "Recent spending trend is stable or improving.",
        )

    # -----------------------------
    # PERSONALITY BASED
    # -----------------------------
    add_unique(
        optimization,
        f"Detected financial personality: {behavior['personality']}.",
    )

    # -----------------------------
    # FINAL RESPONSE
    # -----------------------------
    return {
        "ai_insights": insights,
        "behavioral_signals": behavioral_signals,
        "optimization_opportunities": optimization,
        "total_insights": len(insights),
    }