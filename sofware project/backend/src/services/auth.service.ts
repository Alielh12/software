import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";
import prisma from "../prisma/client";
import { AppError } from "../middlewares/errorHandler";
import { logger } from "../server";

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

class AuthService {
  async register(data: RegisterData) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError("User already exists", 409, "USER_EXISTS");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      data.password,
      config.bcryptRounds
    );

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: (data.role as any) || "STUDENT",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const token = this.generateAccessToken(user.id, user.email, user.role);

    logger.info({ userId: user.id, email: user.email }, "User registered");

    return {
      user,
      token,
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    if (!user.isActive) {
      throw new AppError("Account is deactivated", 403, "ACCOUNT_DEACTIVATED");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const token = this.generateAccessToken(user.id, user.email, user.role);

    logger.info({ userId: user.id, email: user.email }, "User logged in");

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  }

  async refreshToken(refreshToken: string) {
    if (!config.jwtRefreshSecret) {
      throw new AppError("Refresh token not configured", 500, "CONFIG_ERROR");
    }

    try {
      const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        throw new AppError("Invalid refresh token", 401, "INVALID_TOKEN");
      }

      const token = this.generateAccessToken(user.id, user.email, user.role);

      return { token };
    } catch (error) {
      throw new AppError("Invalid refresh token", 401, "INVALID_TOKEN");
    }
  }

  private generateAccessToken(id: string, email: string, role: string): string {
    if (!config.jwtSecret) {
      throw new AppError("JWT secret not configured", 500, "CONFIG_ERROR");
    }

    return jwt.sign(
      { id, email, role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }
}

export const authService = new AuthService();

