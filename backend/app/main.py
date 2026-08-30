from contextlib import asynccontextmanager

import logfire
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth.owner import owner_router
from app.api.auth.service_providers_company import (
    serviceprovidercompany_router,
)
from app.api.chat.chat_session import router
from app.api.guestmode import guest_mode_router

from app.core.config import settings
from app.core.database import init_db
from app.core.observability import setup_observability


# ============================================================
# Application lifespan
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    setup_observability()

    # Logfire FastAPI instrumentation
    if settings.LOGFIRE_TOKEN:
        logfire.instrument_fastapi(app)

    yield


# ============================================================
# FastAPI application
# ============================================================

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    lifespan=lifespan,
)


# ============================================================
# CORS
# ============================================================

origins = [ # Local development 
    "http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173", # Production frontend 
    "https://agentreach-psi.vercel.app", ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Or ["*"] during local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Routers
# ============================================================

app.include_router(
    guest_mode_router
)

app.include_router(
    router
)

app.include_router(
    serviceprovidercompany_router
)

app.include_router(
    owner_router
)


# ============================================================
# Database
# ============================================================

init_db()


# ============================================================
# Health check
# ============================================================

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
    }


# ============================================================
# Development server
# ============================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
    )