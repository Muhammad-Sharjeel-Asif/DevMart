from decimal import Decimal
from typing import Optional
from uuid import UUID
from pydantic import BaseModel
from datetime import datetime

class GigBase(BaseModel):
    title: str
    description: str
    price: Decimal
    delivery_days: int
    is_active: bool = True

class GigCreate(GigBase):
    pass

class GigUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    delivery_days: Optional[int] = None
    is_active: Optional[bool] = None

class GigRead(GigBase):
    id: UUID
    freelancer_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True
