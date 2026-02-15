from typing import Optional, List, TYPE_CHECKING
from uuid import UUID, uuid4
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .user import User
    from .order import Order


class Message(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    sender_id: UUID = Field(foreign_key="user.id")
    receiver_id: UUID = Field(foreign_key="user.id")
    order_id: Optional[UUID] = Field(default=None, foreign_key="order.id")
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    sender: "User" = Relationship(back_populates="sent_messages", sa_relationship_kwargs={"foreign_keys": "Message.sender_id"})
    receiver: "User" = Relationship(back_populates="received_messages", sa_relationship_kwargs={"foreign_keys": "Message.receiver_id"})
    order: Optional["Order"] = Relationship(back_populates="messages")