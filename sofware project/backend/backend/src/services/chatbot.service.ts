import axios from "axios";
import { config } from "../config";
import { AppError } from "../middlewares/errorHandler";
import { logger } from "../server";

class ChatbotService {
  async forwardChatRequest(
    userId: string,
    message: string,
    conversationId?: string
  ) {
    try {
      const response = await axios.post(
        `${config.chatbotServiceUrl}/chat`,
        {
          message,
          user_id: userId,
          conversation_id: conversationId || userId,
        },
        {
          timeout: 30000, // 30 seconds timeout
        }
      );

      return response.data;
    } catch (error: any) {
      logger.error({ error: error.message }, "Chatbot service error");
      if (error.response) {
        throw new AppError(
          error.response.data?.detail || "Chatbot service error",
          error.response.status || 500,
          "CHATBOT_ERROR"
        );
      }
      throw new AppError("Chatbot service unavailable", 503, "SERVICE_UNAVAILABLE");
    }
  }

  async getConversationHistory(conversationId: string, userId: string) {
    try {
      const response = await axios.get(
        `${config.chatbotServiceUrl}/conversations/${conversationId}`,
        {
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error: any) {
      logger.error({ error: error.message }, "Chatbot service error");
      if (error.response) {
        throw new AppError(
          error.response.data?.detail || "Chatbot service error",
          error.response.status || 500,
          "CHATBOT_ERROR"
        );
      }
      throw new AppError("Chatbot service unavailable", 503, "SERVICE_UNAVAILABLE");
    }
  }
}

export const chatbotService = new ChatbotService();

