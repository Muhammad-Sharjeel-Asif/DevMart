from typing import Dict
from uuid import UUID
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # Maps user_id (as string) to their active WebSocket connection
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: UUID):
        await websocket.accept()
        self.active_connections[str(user_id)] = websocket

    def disconnect(self, user_id: UUID):
        user_str = str(user_id)
        if user_str in self.active_connections:
            del self.active_connections[user_str]

    async def send_personal_message(self, message: str, user_id: UUID):
        user_str = str(user_id)
        if user_str in self.active_connections:
            websocket = self.active_connections[user_str]
            await websocket.send_text(message)

manager = ConnectionManager()
