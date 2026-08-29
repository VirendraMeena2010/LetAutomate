"""
llm=ChatOllama(
    model="qwen2.5:7b",
    base_url="https://quest-solve-conventional-witch.trycloudflare.com"
)



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


import os
from langchain_ollama import ChatOllama
from dotenv import load_dotenv
from langchain_nvidia_ai_endpoints import ChatNVIDIA

load_dotenv()

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")

if not NVIDIA_API_KEY:
    raise RuntimeError("NVIDIA_API_KEY is not set in the environment.")

# ============================================================
# Base LLM
# ============================================================

llm = ChatNVIDIA(
     api_key="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",
    model="openai/gpt-oss-120b",
    base_url="https://integrate.api.nvidia.com/v1",
    timeout=1800,
)


# ============================================================
# Primary LLM
# ============================================================

primary_llm = ChatNVIDIA(
    api_key="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",
    model="openai/gpt-oss-120b",
    base_url="https://integrate.api.nvidia.com/v1",
    timeout=1800,
)


# ============================================================
# Fallback LLM
# ============================================================

fallback_llm = ChatNVIDIA(
    api_key="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",
    model="openai/gpt-oss-120b",
    base_url="https://integrate.api.nvidia.com/v1",
    timeout=1800,
)

from langchain_openai import ChatOpenAI
from langchain_ollama import ChatOllama
base="https://luther-easy-immediate-urw.trycloudflare.com"
llm=ChatOllama(
    model="qwen3:8b",
    base_url=base
)

primary_llm=ChatOllama(
    model="qwen3:8b",
    base_url=base
)


fallback_llm=ChatOllama(
    model="qwen3:8b",
    base_url=base
)

from langchain_openrouter import ChatOpenRouter

api="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"
model="google/gemma-4-26b-a4b-it:free"
base="https://openrouter.ai/api/v1"
llm=ChatOpenRouter(
    model=model,
    base_url=base,
    api_key=api
)

primary_llm=ChatOpenRouter(
    model=model,
    base_url=base,
    api_key=api
)


fallback_llm=ChatOpenRouter(
    model=model,
    base_url=base,
    api_key=api
)
"""

"""


base1="https://luther-easy-immediate-urw.trycloudflare.com"
llm1=ChatOllama(
    model="qwen3:8b",
    base_url=base1
)

primary_llm1=ChatOllama(
    model="qwen3:8b",
    base_url=base1
)


fallback_llm1=ChatOllama(
    model="qwen3:8b",
    base_url=base1
)




base1="https://luther-easy-immediate-urw.trycloudflare.com"
llm1=ChatOllama(
    model="qwen3:8b",
    base_url=base1
)

primary_llm1=ChatOllama(
    model="qwen3:8b",
    base_url=base1
)


fallback_llm1=ChatOllama(
    model="qwen3:8b",
    base_url=base1,
    a
    )"""



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