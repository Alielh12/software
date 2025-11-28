from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List
import os
from dotenv import load_dotenv
from app.services.chat_service import ChatService
from app.utils.auth import verify_token

load_dotenv()

app = FastAPI(
    title="CareConnect Chatbot API",
    description="AI-powered health assistant chatbot",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize chat service
chat_service = ChatService()


class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    user_id: Optional[str] = None
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    conversation_id: str


@app.get("/")
async def root():
    return {
        "service": "CareConnect Chatbot",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/chat", response_model=ChatResponse)
async def chat(
    chat_message: ChatMessage,
    authorization: Optional[str] = Header(None),
):
    """
    Send a message to the chatbot and receive a response.
    """
    try:
        # Verify token if provided
        user_id = None
        if authorization:
            try:
                token = authorization.replace("Bearer ", "")
                payload = verify_token(token)
                user_id = payload.get("id") or chat_message.user_id
            except Exception:
                # If token verification fails, continue without auth
                pass

        if not user_id:
            user_id = chat_message.user_id or "anonymous"

        # Get response from chat service
        response = await chat_service.get_response(
            message=chat_message.message,
            user_id=user_id,
            conversation_id=chat_message.conversation_id,
        )

        return ChatResponse(
            response=response["message"],
            conversation_id=response.get("conversation_id", user_id),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@app.get("/conversations/{conversation_id}")
async def get_conversation_history(
    conversation_id: str,
    authorization: Optional[str] = Header(None),
):
    """
    Get conversation history for a specific conversation.
    """
    try:
        if authorization:
            token = authorization.replace("Bearer ", "")
            verify_token(token)

        history = await chat_service.get_conversation_history(conversation_id)
        return {"conversation_id": conversation_id, "messages": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)

