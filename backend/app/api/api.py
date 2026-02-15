from fastapi import APIRouter
from app.api.endpoints import gigs, orders, reviews, messages

api_router = APIRouter()
api_router.include_router(gigs.router, prefix="/gigs", tags=["gigs"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(messages.router, prefix="/messages", tags=["messages"])
