def detect_lifestyle_inflation(monthly_trend):
    """
    Stable fintech-style lifestyle inflation detection.
    Prevents unrealistic percentages.
    """

    if len(monthly_trend) < 3:
        return "stable", 0

    values = [m["value"] for m in monthly_trend]

    # ----------------------------------
    # USE MOVING AVERAGE BASELINE
    # ----------------------------------
    baseline = sum(values[:-1]) / max(1, len(values[:-1]))
    latest = values[-1]

    # avoid divide-by-small problem
    if baseline < 500:
        return "stable", 0

    inflation = ((latest - baseline) / baseline) * 100

    # ----------------------------------
    # CLAMP EXTREMES (VERY IMPORTANT)
    # ----------------------------------
    inflation = max(-30, min(inflation, 40))

    # ----------------------------------
    # LABELS
    # ----------------------------------
    if inflation > 20:
        level = "high"
    elif inflation > 8:
        level = "moderate"
    else:
        level = "stable"

    return level, round(inflation, 1)