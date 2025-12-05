import { Router } from "express";
import { emergencyController } from "../controllers/emergency.controller";
import { authenticateToken, requireRole } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Emergency
 *   description: Emergency request management endpoints
 */

router.use(authenticateToken);

router.post("/", emergencyController.createEmergencyRequest);
router.get("/", requireRole("DOCTOR", "NURSE", "ADMIN"), emergencyController.getEmergencyRequests);
router.get("/:id", emergencyController.getEmergencyRequestById);
router.patch("/:id/assign", requireRole("DOCTOR", "NURSE", "ADMIN"), emergencyController.assignStaff);
router.patch("/:id/status", requireRole("DOCTOR", "NURSE", "ADMIN"), emergencyController.updateStatus);

export { router as emergencyRoutes };

