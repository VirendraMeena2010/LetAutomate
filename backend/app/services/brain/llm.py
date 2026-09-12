

import os

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()


# ============================================================
# AICredits Configuration
# ============================================================

AICREDITS_API_KEY = os.getenv("AICREDITS_API_KEY")

if not AICREDITS_API_KEY:
    raise RuntimeError("AICREDITS_API_KEY is not set in the environment.")

AICREDITS_BASE_URL = "https://api.aicredits.in/v1"
MODEL_NAME = "openai/gpt-4o-mini"


# ============================================================
# Base LLM
# ============================================================

llm = ChatOpenAI(
    model=MODEL_NAME,
    api_key=AICREDITS_API_KEY,
    base_url=AICREDITS_BASE_URL,
    timeout=1800,
    max_retries=2,
)


# ============================================================
# Primary LLM
# ============================================================

primary_llm = ChatOpenAI(
    model=MODEL_NAME,
    api_key=AICREDITS_API_KEY,
    base_url=AICREDITS_BASE_URL,
    timeout=1800,
    max_retries=2,
)


# ============================================================
# Fallback LLM
# ============================================================

fallback_llm = ChatOpenAI(
    model=MODEL_NAME,
    api_key=AICREDITS_API_KEY,
    base_url=AICREDITS_BASE_URL,
    timeout=1800,
    max_retries=2,
)