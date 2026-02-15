from typing import Dict, List, Optional
from fastapi import HTTPException
from sqlmodel import Session
from app.models.order import Order

# VALID_TRANSITIONS defines the allowed state machine for an Order.
# Each key is a current status, and the value is a list of allowed next statuses.
VALID_TRANSITIONS: Dict[str, List[str]] = {
    "PENDING_PAYMENT": ["PAYMENT_SUBMITTED"],
    "PAYMENT_SUBMITTED": ["PAYMENT_CONFIRMED"],
    "PAYMENT_CONFIRMED": ["IN_PROGRESS"],
    "IN_PROGRESS": ["SUBMITTED"],
    "SUBMITTED": ["COMPLETED", "REVISION_REQUESTED"],
    # Allow cycling back from revision to in_progress
    "REVISION_REQUESTED": ["IN_PROGRESS"],
}

def validate_transition(current_status: str, new_status: str) -> bool:
    """
    Checks if a status transition is valid according to the VALID_TRANSITIONS map.
    """
    allowed_next_statuses = VALID_TRANSITIONS.get(current_status, [])
    return new_status in allowed_next_statuses

def change_order_status(session: Session, order: Order, new_status: str) -> Order:
    """
    Updates the order status after validating the transition.
    
    Args:
        session (Session): The database session.
        order (Order): The order object to update.
        new_status (str): The target status.

    Raises:
        HTTPException: If the transition is invalid (400 Bad Request).
    
    Returns:
        Order: The updated and refreshed order object.
    """
    current_status = order.status
    
    # Idempotency check: if status is already set, do nothing.
    if current_status == new_status:
        return order

    if not validate_transition(current_status, new_status):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status transition from '{current_status}' to '{new_status}'"
        )
    
    order.status = new_status
    session.add(order)
    session.commit()
    session.refresh(order)
    
    return order
