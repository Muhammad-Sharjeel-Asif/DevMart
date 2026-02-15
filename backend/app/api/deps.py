from fastapi import Depends
from sqlmodel import Session
from app.database import get_session
from app.dependencies.auth import get_current_user

# Create standard dependencies alias for simpler imports in routers
def get_db():
    yield from get_session()

# Re-export get_current_user and get_session for convenience in API routes
# This acts as the central dependency injection container
deps = {
    "get_session": get_session,
    "get_current_user": get_current_user
}
