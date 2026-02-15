from uuid import UUID
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageBase(BaseModel):
    receiver_id: UUID
    content: str
    order_id: Optional[UUID] = None

class MessageCreate(MessageBase):
    pass

class MessageRead(MessageBase):
    id: UUID
    sender_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True
