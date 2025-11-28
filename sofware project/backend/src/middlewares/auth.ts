import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { AppError } from "./errorHandler";
import prisma from "../prisma/client";
import { logger } from "../server";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Middleware to verify JWT token
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Access token required", 401, "MISSING_TOKEN");
    }

    if (!config.jwtSecret) {
      logger.error("JWT_SECRET is not configured");
      throw new AppError("Server configuration error", 500, "CONFIG_ERROR");
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;

    // Optionally verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user) {
      throw new AppError("User not found", 401, "USER_NOT_FOUND");
    }

    if (!user.isActive) {
      throw new AppError("User account is deactivated", 403, "ACCOUNT_DEACTIVATED");
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError("Invalid or expired token", 401, "INVALID_TOKEN"));
    } else if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Authentication failed", 401, "AUTH_FAILED"));
    }
  }
};

/**
 * Middleware to require specific roles
 */
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        {
          userId: req.user.id,
          userRole: req.user.role,
          requiredRoles: roles,
          path: req.path,
        },
        "Access denied: insufficient permissions"
      );
      return next(
        new AppError("Insufficient permissions", 403, "INSUFFICIENT_PERMISSIONS")
      );
    }

    next();
  };
};

/**
 * Middleware to allow access to own resource or specific roles
 */
export const requireOwnershipOrRole = (...roles: string[]) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));
    }

    const resourceUserId = req.params.userId || req.body.userId;

    // Allow if user owns the resource or has required role
    if (resourceUserId === req.user.id || roles.includes(req.user.role)) {
      return next();
    }

    return next(
      new AppError("Access denied", 403, "ACCESS_DENIED")
    );
  };
};

