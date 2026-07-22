from contextlib import asynccontextmanager
import uvicorn
import logfire
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <-- 1. Added this import

#from app.api.chat import chat_router
from app.api.guestmode import guest_mode_router
from app.core.config import settings
from app.core.observability import setup_observability


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_observability()
    logfire.instrument_fastapi(app)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    lifespan=lifespan,
)

# --- 2. Added CORS Middleware Block ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)
# --------------------------------------

#app.include_router(chat_router)
app.include_router(guest_mode_router)


@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)