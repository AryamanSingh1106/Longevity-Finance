from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# -------------------------
# ML ENGINES
# -------------------------
import engine.session as session
from engine.dashboard import dashboard_engine
from engine.behavior import behavior_engine
from engine.insights import insights_engine
from engine.microsavings import microsavings_engine

# 🔥 ENHANCER (NEW)
from engine.enhancer.behavior_enhancer import enhance_transactions

# -------------------------
# PLAID
# -------------------------
from engine.plaid_client import client

from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.transactions_refresh_request import TransactionsRefreshRequest

from datetime import date, timedelta
import time
import urllib3
import http.client

app = FastAPI()

# -------------------------
# CORS
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# CATEGORY MAP
# -------------------------
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
    "ENTERTAINMENT": "Lifestyle"
}

ALLOWED_CATEGORIES = [
    "Housing",
    "Food",
    "Transport",
    "Shopping",
    "Lifestyle"
]

# ===================================================
# ML ROUTES
# ===================================================

@app.get("/api/dashboard")
async def get_dashboard():
    return dashboard_engine()

@app.get("/api/behavior")
async def get_behavior():
    return behavior_engine()

@app.get("/api/microsavings")
async def get_microsavings():
    return microsavings_engine()

@app.get("/api/insights")
async def get_insights():
    return insights_engine()

# ===================================================
# PLAID ROUTES
# ===================================================

@app.get("/api/create_link_token")
def create_link_token():

    request = LinkTokenCreateRequest(
        user=LinkTokenCreateRequestUser(client_user_id="user-123"),
        products=[Products("transactions")],
        client_name="Longevity Finance",
        country_codes=[CountryCode("US")],
        language="en"
    )

    response = client.link_token_create(request)
    return {"link_token": response["link_token"]}


@app.post("/api/exchange_public_token")
def exchange_public_token(data: dict):

    public_token = data.get("public_token")
    if not public_token:
        raise HTTPException(status_code=400, detail="Missing public_token")

    exchange_request = ItemPublicTokenExchangeRequest(
        public_token=public_token
    )

    last_error = None

    for attempt in range(3):
        try:
            response = client.item_public_token_exchange(exchange_request)
            break
        except (
            urllib3.exceptions.ProtocolError,
            ConnectionError,
            OSError,
            http.client.RemoteDisconnected
        ) as e:
            last_error = e
            if attempt < 2:
                time.sleep(0.5)
            else:
                raise HTTPException(
                    status_code=503,
                    detail="Plaid connection failed"
                ) from last_error

    session.SAVED_ACCESS_TOKEN = response["access_token"]

    return {"message": "Access token saved successfully"}


# ===================================================
# 90 DAY TRANSACTIONS (ENHANCED)
# ===================================================

@app.get("/api/transactions")
def get_transactions():

    if not session.SAVED_ACCESS_TOKEN:
        return {"error": "No access token found"}

    try:
        refresh_request = TransactionsRefreshRequest(
            access_token=session.SAVED_ACCESS_TOKEN
        )
        #client.transactions_refresh(refresh_request)
    except Exception as e:
        print("Refresh skipped:", e)

    today = date.today()
    start_date = today - timedelta(days=90)

    request = TransactionsGetRequest(
        access_token=session.SAVED_ACCESS_TOKEN,
        start_date=start_date,
        end_date=today
    )

    response = client.transactions_get(request)
    transactions = response.to_dict()["transactions"]

    cleaned = []

    for t in transactions:

        amount = t["amount"]
        if amount <= 0:
            continue

        plaid_category = (
            t["personal_finance_category"]["primary"]
            if t["personal_finance_category"]
            else None
        )

        ui_category = CATEGORY_MAP.get(plaid_category)

        if ui_category not in ALLOWED_CATEGORIES:
            continue

        merchant = t["merchant_name"] or t["name"]

        cleaned.append({
            "date": str(t["date"]),
            "receiver": merchant,
            "amount": round(amount, 2),
            "category": ui_category
        })

    cleaned.sort(key=lambda x: x["date"], reverse=True)

    # 🔥 APPLY REALISM ENHANCER
    enhanced = enhance_transactions(cleaned)

    return {
        "period": "last_90_days",
        "transactions": enhanced
    }