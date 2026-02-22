# ==========================================
# ANOMALY DETECTION MODEL
# ==========================================

def detect_spending_anomalies_ml(monthly_trend):
    """
    Detects abnormal spending spikes compared to average spending.

    INPUT:
        monthly_trend = [
            {"month": "2025-01", "value": 1200},
            {"month": "2025-02", "value": 2400},
            ...
        ]

    RETURNS:
        anomalies (list)
        anomalies_count (int)
    """

    # --------------------------------------
    # SAFETY CHECKS
    # --------------------------------------
    if not monthly_trend or len(monthly_trend) < 2:
        return [], 0

    # --------------------------------------
    # CALCULATE AVERAGE SPENDING
    # --------------------------------------
    values = [m["value"] for m in monthly_trend]
    avg = sum(values) / len(values)

    if avg == 0:
        return [], 0

    anomalies = []

    # --------------------------------------
    # DETECT SPIKES
    # (30% above average = anomaly)
    # --------------------------------------
    for item in monthly_trend:

        month = item["month"]
        value = item["value"]

        # anomaly condition
        if value > avg * 1.3:

            difference = value - avg
            percent = round((difference / avg) * 100, 1)

            impact = f"+{percent}%" if percent > 0 else f"{percent}%"

            anomalies.append({
                "month": month,
                "value": value,
                "impact": impact,
                "type": "spike"
            })

    # --------------------------------------
    # RETURN RESULT
    # --------------------------------------
    return anomalies, len(anomalies)