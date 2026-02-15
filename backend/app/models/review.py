from typing import Optional, List, TYPE_CHECKING
from uuid import UUID, uuid4
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship, UniqueConstraint

if TYPE_CHECKING:
    from .user import User
    from .order import Order


class Review(SQLModel, table=True):
    __table_args__ = (UniqueConstraint('order_id', 'reviewer_id'),)

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    order_id: UUID = Field(foreign_key="order.id")
    reviewer_id: UUID = Field(foreign_key="user.id")
    reviewee_id: UUID = Field(foreign_key="user.id")
    rating: int = Field(ge=1, le=5)
    comment: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    reviewer: "User" = Relationship(back_populates="reviews_given", sa_relationship_kwargs={"foreign_keys": "Review.reviewer_id"})
    reviewee: "User" = Relationship(back_populates="reviews_received", sa_relationship_kwargs={"foreign_keys": "Review.reviewee_id"})
    order: "Order" = Relationship(back_populates="reviews")