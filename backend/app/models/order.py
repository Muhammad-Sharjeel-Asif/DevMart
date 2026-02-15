from typing import Optional, List, TYPE_CHECKING
from uuid import UUID, uuid4
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .user import User
    from .gig import Gig
    from .payment import PaymentProof
    from .message import Message
    from .review import Review


class OrderStatus:
    # Updated to match the service layer transition states
    PENDING_PAYMENT = "PENDING_PAYMENT"
    PAYMENT_SUBMITTED = "PAYMENT_SUBMITTED"
    PAYMENT_CONFIRMED = "PAYMENT_CONFIRMED"
    IN_PROGRESS = "IN_PROGRESS"
    SUBMITTED = "SUBMITTED"
    COMPLETED = "COMPLETED"
    REVISION_REQUESTED = "REVISION_REQUESTED"
    CANCELLED = "CANCELLED"


class PaymentStatus:
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"


class Order(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    gig_id: UUID = Field(foreign_key="gig.id")
    client_id: UUID = Field(foreign_key="user.id")
    freelancer_id: UUID = Field(foreign_key="user.id")
    # Default status should align with the start of the flow
    status: str = Field(default=OrderStatus.PENDING_PAYMENT)
    payment_status: str = Field(default=PaymentStatus.PENDING)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    gig: "Gig" = Relationship(back_populates="orders")
    client: "User" = Relationship(back_populates="orders_as_client", sa_relationship_kwargs={"foreign_keys": "Order.client_id"})
    freelancer: "User" = Relationship(back_populates="orders_as_freelancer", sa_relationship_kwargs={"foreign_keys": "Order.freelancer_id"})
    payment_proof: Optional["PaymentProof"] = Relationship(back_populates="order")
    messages: List["Message"] = Relationship(back_populates="order")
    reviews: List["Review"] = Relationship(back_populates="order")