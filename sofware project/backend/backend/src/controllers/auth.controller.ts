import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authService } from "../services/auth.service";
import { config } from "../config";
import prisma from "../prisma/client";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body.email, req.body.password);
      // Set HTTP-only cookie for token
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // For cross-site requests (frontend on different origin), set to 'none' in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.token;

      if (!token) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      if (!config.jwtSecret) {
        throw new Error("JWT secret not configured");
      }

      const decoded = jwt.verify(token, config.jwtSecret) as any;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Clear the cookie (match same options as when set)
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.refreshToken(req.body.refreshToken);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();

