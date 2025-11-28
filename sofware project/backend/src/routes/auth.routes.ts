import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authRateLimiter } from "../middlewares/rateLimiter";
import { validate } from "../middlewares/validation";
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
} from "../validators/auth.validator";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 */
router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  authController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 */
router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  authController.login
);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 */
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  authController.refreshToken
);

export { router as authRoutes };

