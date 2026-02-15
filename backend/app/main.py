from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.core.limiter import limiter
from app.database import engine
from app.models import User, Gig, Order, Message, Review, PaymentProof
from app.dependencies.auth import get_current_user
from app.api.api import api_router
from app.config import settings

# Initialize Rate Limiter
# (limiter is now initialized in app/core/limiter.py)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(lifespan=lifespan, title="DevMarket API", version="1.0.0")

# Add Rate Limiting Error Handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# HARDENED CORS: Restrict to production-ready origins
# Read from settings if available, else fallback to dev
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Add your production domain here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Cookie"],
    max_age=3600, # Cache preflight requests for 1 hour
)

# Include the main API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
@limiter.limit("60/minute")
def read_root(request: Request):
    return {"message": "Welcome to DevMarket API"}

@app.get("/me", response_model=User)
@limiter.limit("30/minute")
def read_users_me(request: Request, current_user: User = Depends(get_current_user)):
    return current_user