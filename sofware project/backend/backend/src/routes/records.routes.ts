import { Router } from "express";
import { recordsController } from "../controllers/records.controller";
import { authenticateToken, requireRole } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Medical Records
 *   description: Medical records management endpoints
 */

router.use(authenticateToken);

router.get("/:id/encrypted", recordsController.getEncryptedRecord);
router.get("/:id/key", recordsController.getDecryptionKey);
router.get("/:id/verify-access", recordsController.verifyAccess);
router.post("/", requireRole("DOCTOR", "NURSE", "ADMIN"), recordsController.createRecord);
router.get("/", recordsController.getRecords);
router.get("/:id", recordsController.getRecordById);

export { router as recordsRoutes };

