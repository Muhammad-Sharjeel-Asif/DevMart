from fastapi import Depends, HTTPException, status, Request
from jose import JWTError
from sqlmodel import Session, select
from app.database import get_session
from app.models.user import User
from app.core.security import verify_jwt
from uuid import UUID

def get_current_user(request: Request, db: Session = Depends(get_session)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
    
    if not token:
        raise credentials_exception

    payload = verify_jwt(token)
    if payload is None:
        raise credentials_exception
    
    user_id_str: str = payload.get("sub")
    if user_id_str is None:
        raise credentials_exception
        
    try:
        user_uuid = UUID(user_id_str)
    except ValueError:
        raise credentials_exception
        
    user = db.exec(select(User).where(User.id == user_uuid)).first()
    if user is None:
        raise credentials_exception
        
    return user
