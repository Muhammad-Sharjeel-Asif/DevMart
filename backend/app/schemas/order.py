from uuid import UUID
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class OrderBase(BaseModel):
    gig_id: UUID

class OrderCreate(OrderBase):
    pass

class OrderRead(BaseModel):
    id: UUID
    gig_id: UUID
    client_id: UUID
    freelancer_id: UUID
    status: str
    payment_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Payment Proof Schema (Embedded or Separate?)
class PaymentProofCreate(BaseModel):
    proof_reference: str
    payer_name: str
    amount: Decimal
