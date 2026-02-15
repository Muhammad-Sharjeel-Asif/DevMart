from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from sqlmodel import Session, select, or_

from app.api import deps
from app.models.message import Message
from app.models.user import User
from app.schemas.message import MessageCreate, MessageRead
from app.websocket.connection_manager import manager
from app.dependencies.auth import get_current_user

router = APIRouter()

# --- REST Endpoints ---

@router.post("/", response_model=MessageRead)
async def send_message(
    message_in: MessageCreate,
    current_user: User = Depends(deps.get_current_user),
    session: Session = Depends(deps.get_session)
):
    """
    Send a message via REST API.
    1. Validates receiver exists.
    2. Saves to DB.
    3. Pushes to WebSocket if receiver is connected.
    """
    # Check if receiver exists
    receiver = session.get(User, message_in.receiver_id)
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")

    # Create message record
    message = Message(
        sender_id=current_user.id,
        receiver_id=message_in.receiver_id,
        content=message_in.content,
        order_id=message_in.order_id
    )
    session.add(message)
    session.commit()
    session.refresh(message)

    # Push to WebSocket if connected
    # We send a JSON string representation or just the content. 
    # For now sending raw content or a structured JSON string.
    await manager.send_personal_message(
        f"New message from {current_user.full_name}: {message.content}",
        message.receiver_id
    )

    return message

@router.get("/{user_id}", response_model=List[MessageRead])
def get_chat_history(
    user_id: UUID,  # The other user in the conversation
    current_user: User = Depends(deps.get_current_user),
    session: Session = Depends(deps.get_session),
    limit: int = 50,
    skip: int = 0
):
    """
    Get conversation history between current user and another user.
    """
    statement = select(Message).where(
        or_(
            (Message.sender_id == current_user.id) & (Message.receiver_id == user_id),
            (Message.sender_id == user_id) & (Message.receiver_id == current_user.id)
        )
    ).order_by(Message.created_at.desc()).offset(skip).limit(limit)
    
    messages = session.exec(statement).all()
    # Reverse to show chronological order if frontend expects it, 
    # but strictly speaking API returns what DB gives (descending here).
    return messages


# --- WebSocket Endpoint ---

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket, 
    user_id: UUID,
    session: Session = Depends(deps.get_session)
):
    """
    WebSocket endpoint for real-time messaging.
    Note: Authentication for WebSockets is tricky with cookies/headers in standard Depends.
    Here we assume the client connects and we trust the user_id path param matches the verified session 
    or we implement a query param token check.
    
    For strict security, you should validate a token sent in query params: ws://.../ws?token=...
    Implementation below is a basic structure.
    """
    # In a real app, validate token here!
    # token = websocket.query_params.get("token")
    # user = verify_token(token)
    
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming WebSocket messages if any (e.g. typing indicators)
            # Or simplified: Client sends message via REST POST, and receives via WS.
            # If we want full WS chat:
            # 1. Parse 'data' (JSON) containing content and receiver_id
            # 2. Save to DB
            # 3. manager.send_personal_message(...)
            pass
    except WebSocketDisconnect:
        manager.disconnect(user_id)
