from typing import Optional, List, TYPE_CHECKING
from uuid import UUID, uuid4
from decimal import Decimal
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .user import User
    from .order import Order


class Gig(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    freelancer_id: UUID = Field(foreign_key="user.id")
    title: str
    description: str
    price: Decimal = Field(default=Decimal("0"), max_digits=10, decimal_places=2)
    delivery_days: int
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    freelancer: "User" = Relationship(back_populates="gigs")
    orders: List["Order"] = Relationship(back_populates="gig")