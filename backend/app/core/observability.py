import os

import logfire

from app.core.config import settings


def setup_observability() -> None:
    """
    Configure Logfire and LangSmith.
    """

    # ----------------------------
    # LangSmith
    # ----------------------------

    os.environ["LANGSMITH_TRACING"] = (
        "true" if settings.LANGSMITH_TRACING else "false"
    )

    os.environ["LANGSMITH_ENDPOINT"] = settings.LANGSMITH_ENDPOINT
    os.environ["LANGSMITH_API_KEY"] = settings.LANGSMITH_API_KEY
    os.environ["LANGSMITH_PROJECT"] = settings.LANGSMITH_PROJECT

    # ----------------------------
    # Logfire
    # ----------------------------

    logfire.configure(
        service_name=settings.LOGFIRE_SERVICE_NAME,
        token=settings.LOGFIRE_TOKEN,
        environment=settings.ENVIRONMENT,
    )