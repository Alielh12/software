import { Router } from "express";
import { chatbotController } from "../controllers/chatbot.controller";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Chatbot
 *   description: Chatbot service forwarding endpoints
 */

router.use(authenticateToken);

router.post("/chat", chatbotController.forwardChat);
router.get("/conversations/:conversationId", chatbotController.getConversationHistory);

export { router as chatbotRoutes };

