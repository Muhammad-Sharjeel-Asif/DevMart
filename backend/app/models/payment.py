from typing import Optional, List, TYPE_CHECKING
from uuid import UUID, uuid4
from decimal import Decimal
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .order import Order
    from .user import User


class PaymentProof(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    order_id: UUID = Field(foreign_key="order.id", unique=True)
    user_id: UUID = Field(foreign_key="user.id")
    proof_reference: str
    payer_name: str
    amount: Decimal = Field(default=Decimal("0"), max_digits=10, decimal_places=2)
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    verified: bool = Field(default=False)

    # Relationships
    order: "Order" = Relationship(back_populates="payment_proof")
    user: "User" = Relationship(back_populates="payments")