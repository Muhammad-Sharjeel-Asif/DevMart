from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select
from app.api import deps
from app.core.limiter import limiter
from app.models.gig import Gig
from app.models.user import User
from app.schemas.gig import GigCreate, GigUpdate, GigRead

router = APIRouter()

@router.get("/", response_model=List[GigRead])
def read_gigs(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    session: Session = Depends(deps.get_session)
):
    query = select(Gig)
    if active_only:
        query = query.where(Gig.is_active == True)
    query = query.offset(skip).limit(limit)
    gigs = session.exec(query).all()
    return gigs

@router.post("/", response_model=GigRead)
@limiter.limit("10/minute")
def create_gig(
    request: Request,
    gig_in: GigCreate,
    current_user: User = Depends(deps.get_current_user),
    session: Session = Depends(deps.get_session)
):
    # Create Gig model
    gig = Gig.from_orm(gig_in)
    gig.freelancer_id = current_user.id
    
    session.add(gig)
    session.commit()
    session.refresh(gig)
    return gig

@router.get("/{id}", response_model=GigRead)
def read_gig(
    id: UUID,
    session: Session = Depends(deps.get_session)
):
    gig = session.get(Gig, id)
    if not gig:
        raise HTTPException(status_code=404, detail="Gig not found")
    return gig

@router.patch("/{id}", response_model=GigRead)
def update_gig(
    id: UUID,
    gig_update: GigUpdate,
    current_user: User = Depends(deps.get_current_user),
    session: Session = Depends(deps.get_session)
):
    gig = session.get(Gig, id)
    if not gig:
        raise HTTPException(status_code=404, detail="Gig not found")
        
    if gig.freelancer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    gig_data = gig_update.dict(exclude_unset=True)
    for key, value in gig_data.items():
        setattr(gig, key, value)
        
    session.add(gig)
    session.commit()
    session.refresh(gig)
    return gig

@router.delete("/{id}")
def delete_gig(
    id: UUID,
    current_user: User = Depends(deps.get_current_user),
    session: Session = Depends(deps.get_session)
):
    gig = session.get(Gig, id)
    if not gig:
        raise HTTPException(status_code=404, detail="Gig not found")
        
    if gig.freelancer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    session.delete(gig)
    session.commit()
    return {"ok": True}
