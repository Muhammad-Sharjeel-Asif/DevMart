from uuid import UUID
from pydantic import BaseModel, Field
from datetime import datetime

class ReviewBase(BaseModel):
    order_id: UUID
    rating: int = Field(ge=1, le=5)
    comment: str

class ReviewCreate(ReviewBase):
    pass

class ReviewRead(ReviewBase):
    id: UUID
    reviewer_id: UUID
    reviewee_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True
