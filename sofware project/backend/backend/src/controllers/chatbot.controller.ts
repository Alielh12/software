import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth";
import { chatbotService } from "../services/chatbot.service";

class ChatbotController {
  async forwardChat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response = await chatbotService.forwardChatRequest(
        req.user!.id,
        req.body.message,
        req.body.conversationId
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getConversationHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const history = await chatbotService.getConversationHistory(
        req.params.conversationId,
        req.user!.id
      );
      res.json(history);
    } catch (error) {
      next(error);
    }
  }
}

export const chatbotController = new ChatbotController();

