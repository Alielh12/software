import os
from typing import Dict, List, Optional
from openai import OpenAI
from app.utils.conversation_manager import ConversationManager

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class ChatService:
    def __init__(self):
        self.conversation_manager = ConversationManager()
        self.system_prompt = """You are a helpful health assistant for a university health center. 
        You provide general health information, answer questions about appointments, and guide students 
        on health center services. Always advise users to consult with healthcare professionals for 
        serious medical concerns. Be empathetic, clear, and professional."""

    async def get_response(
        self, message: str, user_id: str, conversation_id: Optional[str] = None
    ) -> Dict[str, any]:
        """
        Get a response from the chatbot using OpenAI API.
        """
        if not conversation_id:
            conversation_id = user_id

        # Get conversation history
        history = self.conversation_manager.get_conversation(conversation_id)

        # Prepare messages for OpenAI
        messages = [{"role": "system", "content": self.system_prompt}]

        # Add conversation history
        for msg in history[-10:]:  # Last 10 messages for context
            messages.append({"role": msg["role"], "content": msg["content"]})

        # Add current user message
        messages.append({"role": "user", "content": message})

        try:
            # Call OpenAI API
            response = client.chat.completions.create(
                model=os.getenv("OPENAI_MODEL", "gpt-4-turbo-preview"),
                messages=messages,
                max_tokens=500,
                temperature=0.7,
            )

            bot_response = response.choices[0].message.content

            # Save to conversation history
            self.conversation_manager.add_message(
                conversation_id, "user", message
            )
            self.conversation_manager.add_message(
                conversation_id, "assistant", bot_response
            )

            return {
                "message": bot_response,
                "conversation_id": conversation_id,
            }
        except Exception as e:
            return {
                "message": "I'm sorry, I'm having trouble processing your request. Please try again or contact the health center directly.",
                "conversation_id": conversation_id,
                "error": str(e),
            }

    async def get_conversation_history(self, conversation_id: str) -> List[Dict]:
        """
        Get the conversation history for a conversation ID.
        """
        return self.conversation_manager.get_conversation(conversation_id)

