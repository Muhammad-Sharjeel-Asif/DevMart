from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.api import deps
from app.schemas.review import ReviewCreate, ReviewRead
from app.models.review import Review
from app.models.order import Order, OrderStatus
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=ReviewRead)
def create_review(
    review_in: ReviewCreate,
    current_user: User = Depends(deps.get_current_user),
    session: Session = Depends(deps.get_session)
):
    # 1. Fetch Order
    order = session.get(Order, review_in.order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # 2. Status Check: Must be COMPLETED
    if order.status != OrderStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Cannot review an incomplete order")
    
    # 3. Determine Reviewer and Reviewee
    # The current user MUST be one of the participants
    if current_user.id == order.client_id:
        reviewer_id = order.client_id
        reviewee_id = order.freelancer_id
    elif current_user.id == order.freelancer_id:
        reviewer_id = order.freelancer_id
        reviewee_id = order.client_id
    else:
        raise HTTPException(status_code=403, detail="You are not a participant in this order")
    
    # 4. Duplicate Check
    # Check if this user has already reviewed this order
    existing_review = session.exec(
        select(Review).where(
            Review.order_id == order.id,
            Review.reviewer_id == reviewer_id
        )
    ).first()
    
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this order")
        
    # 5. Create Review
    review = Review(
        order_id=order.id,
        reviewer_id=reviewer_id,
        reviewee_id=reviewee_id,
        rating=review_in.rating,
        comment=review_in.comment
    )
    
    session.add(review)
    session.commit()
    session.refresh(review)
    return review
