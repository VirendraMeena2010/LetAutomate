import os

import logfire
from langfuse import get_client

from app.core.config import settings


def setup_observability() -> None:
    # ============================================================
    # Disable LangSmith
    # ============================================================

    os.environ["LANGSMITH_TRACING"] = "false"

    # ============================================================
    # Validate Langfuse credentials
    # ============================================================

    if not settings.LANGFUSE_PUBLIC_KEY:
        raise RuntimeError(
            "LANGFUSE_PUBLIC_KEY is missing."
        )

    if not settings.LANGFUSE_SECRET_KEY:
        raise RuntimeError(
            "LANGFUSE_SECRET_KEY is missing."
        )

    # ============================================================
    # Configure Langfuse environment
    # ============================================================

    os.environ["LANGFUSE_PUBLIC_KEY"] = (
        settings.LANGFUSE_PUBLIC_KEY
    )

    os.environ["LANGFUSE_SECRET_KEY"] = (
        settings.LANGFUSE_SECRET_KEY
    )

    os.environ["LANGFUSE_BASE_URL"] = (
        settings.LANGFUSE_BASE_URL
    )

    os.environ["LANGFUSE_TRACING_ENVIRONMENT"] = (
        settings.LANGFUSE_TRACING_ENVIRONMENT
    )

    # ============================================================
    # Initialize Langfuse
    # ============================================================

    langfuse = get_client()

    if not langfuse.auth_check():
        raise RuntimeError(
            "Langfuse authentication failed. "
            "Check LANGFUSE_PUBLIC_KEY and "
            "LANGFUSE_SECRET_KEY."
        )

    print(
        "Langfuse observability initialized successfully."
    )

    # ============================================================
    # Logfire
    # ============================================================

    if settings.LOGFIRE_TOKEN:
        logfire.configure(
            service_name=settings.LOGFIRE_SERVICE_NAME,
            token=settings.LOGFIRE_TOKEN,
            environment=settings.ENVIRONMENT,
        )

        print(
            "Logfire observability initialized successfully."
        )
    else:
        print(
            "Logfire token not configured. "
            "Logfire disabled."
        )