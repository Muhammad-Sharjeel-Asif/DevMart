from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Body, Request
from sqlmodel import Session, select
from app.api import deps
from app.core.limiter import limiter
from app.models.order import Order, OrderStatus
from app.models.gig import Gig
from app.models.payment import PaymentProof
from app.models.user import User
from app.schemas.order import OrderCreate, OrderRead, PaymentProofCreate
from app.services.order_service import change_order_status

router = APIRouter()

@router.post("/", response_model=OrderRead)
@limiter.limit("5/minute")
def create_order(
    request: Request,
    order_in: OrderCreate,
    current_user: User = Depends(deps.get_current_user),
    session: Session = Depends(deps.get_session)
):
    # Retrieve Gig to ensure it exists and get freelancer_id
    gig = session.get(Gig, order_in.gig_id)
    if not gig:
        raise HTTPException(status_code=404, detail="Gig not found")
    
    if gig.freelancer_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot purchase your own gig")

    order = Order(
        gig_id=gig.id,
        client_id=current_user.id,
        freelancer_id=gig.freelancer_id,
        status=OrderStatus.PENDING_PAYMENT,
    )
    
    session.add(order)
    session.commit()
    session.refresh(order)
    return order

@router.get("/", response_model=List[OrderRead])
def read_orders(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
    session: Session = Depends(deps.get_session)
):
    # User can see orders where they are client OR freelancer
    statement = select(Order).where(
        (Order.client_id == current_user.id) | 
        (Order.freelancer_id == current_user.id)
    ).offset(skip).limit(limit)
    orders = session.exec(statement).all()
    return orders

@router.patch("/{id}/submit-payment", response_model=OrderRead)
@limiter.limit("10/minute")
def submit_payment(
    request: Request,
    id: UUID,
    payment_proof_in: PaymentProofCreate,
    current_user: User = Depends(deps.get_current_user),
    session: Session = Depends(deps.get_session)
):
    order = session.get(Order, id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if order.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Create Payment Proof
    payment_proof = PaymentProof(
        order_id=order.id,
        user_id=current_user.id,
        proof_reference=payment_proof_in.proof_reference,
        payer_name=payment_proof_in.payer_name,
        amount=payment_proof_in.amount
    )
    session.add(payment_proof)
    
    # Use Service to update status
    updated_order = change_order_status(session, order, OrderStatus.PAYMENT_SUBMITTED)
    return updated_order

@router.patch("/{id}/confirm-payment", response_model=OrderRead)
def confirm_payment(
    id: UUID,
    current_user: User = Depends(deps.get_current_user),
    session: Session = Depends(deps.get_session)
):
    order = session.get(Order, id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if order.freelancer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only freelancer can confirm payment")

    # Update Payment Proof verified status? Maybe in service or separate.
    # For now, just change order status.
    updated_order = change_order_status(session, order, OrderStatus.PAYMENT_CONFIRMED)
    return updated_order

@router.patch("/{id}/submit-work", response_model=OrderRead)
def submit_work(
    id: UUID,
    current_user: User = Depends(deps.get_current_user),
    session: Session = Depends(deps.get_session)
):
    order = session.get(Order, id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if order.freelancer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    updated_order = change_order_status(session, order, OrderStatus.SUBMITTED)
    return updated_order

@router.patch("/{id}/approve", response_model=OrderRead)
def approve_work(
    id: UUID,
    current_user: User = Depends(deps.get_current_user),
    session: Session = Depends(deps.get_session)
):
    order = session.get(Order, id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if order.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    updated_order = change_order_status(session, order, OrderStatus.COMPLETED)
    return updated_order

@router.patch("/{id}/revision", response_model=OrderRead)
def request_revision(
    id: UUID, 
    current_user: User = Depends(deps.get_current_user),
    session: Session = Depends(deps.get_session)
):
    order = session.get(Order, id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if order.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    updated_order = change_order_status(session, order, OrderStatus.REVISION_REQUESTED)
    return updated_order
