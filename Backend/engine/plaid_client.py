from plaid.api import plaid_api
from plaid.configuration import Configuration
from plaid.api_client import ApiClient
from pathlib import Path
from dotenv import load_dotenv
import os

# -------------------------
# Load Environment Variables
# -------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(ENV_PATH)

PLAID_CLIENT_ID = os.getenv("PLAID_CLIENT_ID")
PLAID_SECRET = os.getenv("PLAID_SECRET")

# -------------------------
# Plaid Configuration
# -------------------------
configuration = Configuration(
    host="https://sandbox.plaid.com",
    api_key={
        "clientId": PLAID_CLIENT_ID,
        "secret": PLAID_SECRET,
    }
)

api_client = ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)