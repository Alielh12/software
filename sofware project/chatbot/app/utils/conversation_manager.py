from typing import Dict, List
from collections import defaultdict


class ConversationManager:
    """
    Simple in-memory conversation manager.
    In production, consider using Redis or a database.
    """

    def __init__(self):
        self.conversations: Dict[str, List[Dict[str, str]]] = defaultdict(list)

    def get_conversation(self, conversation_id: str) -> List[Dict[str, str]]:
        """
        Get all messages for a conversation.
        """
        return self.conversations.get(conversation_id, [])

    def add_message(
        self, conversation_id: str, role: str, content: str
    ) -> None:
        """
        Add a message to a conversation.
        """
        self.conversations[conversation_id].append(
            {"role": role, "content": content}
        )

        # Limit conversation history to last 50 messages
        if len(self.conversations[conversation_id]) > 50:
            self.conversations[conversation_id] = self.conversations[
                conversation_id
            ][-50:]

    def clear_conversation(self, conversation_id: str) -> None:
        """
        Clear a conversation history.
        """
        if conversation_id in self.conversations:
            del self.conversations[conversation_id]

