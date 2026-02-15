from typing import Optional, List, TYPE_CHECKING
from uuid import UUID, uuid4
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .gig import Gig
    from .order import Order
    from .message import Message
    from .review import Review
    from .payment import PaymentProof


class User(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    is_admin: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship attributes (not stored in the database)
    gigs: List["Gig"] = Relationship(back_populates="freelancer", cascade_delete=True)
    
    orders_as_client: List["Order"] = Relationship(
        back_populates="client", 
        sa_relationship_kwargs={"foreign_keys": "Order.client_id"}
    )
    
    orders_as_freelancer: List["Order"] = Relationship(
        back_populates="freelancer", 
        sa_relationship_kwargs={"foreign_keys": "Order.freelancer_id"}
    )
    
    sent_messages: List["Message"] = Relationship(
        back_populates="sender", 
        sa_relationship_kwargs={"foreign_keys": "Message.sender_id"}
    )
    
    received_messages: List["Message"] = Relationship(
        back_populates="receiver", 
        sa_relationship_kwargs={"foreign_keys": "Message.receiver_id"}
    )
    
    reviews_given: List["Review"] = Relationship(
        back_populates="reviewer", 
        sa_relationship_kwargs={"foreign_keys": "Review.reviewer_id"}
    )
    
    reviews_received: List["Review"] = Relationship(
        back_populates="reviewee", 
        sa_relationship_kwargs={"foreign_keys": "Review.reviewee_id"}
    )
    
    payments: List["PaymentProof"] = Relationship(back_populates="user")