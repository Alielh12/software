import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../server";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error(
    {
      error: err,
      url: req.url,
      method: req.method,
      ip: req.ip,
    },
    "Error occurred"
  );

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        statusCode: 400,
        details: err.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      },
    });
  }

  // Handle AppError (operational errors)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
        statusCode: err.statusCode,
      },
    });
  }

  // Handle Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    const prismaError = err as any;
    
    if (prismaError.code === "P2002") {
      return res.status(409).json({
        error: {
          message: "A record with this information already exists",
          code: "DUPLICATE_ENTRY",
          statusCode: 409,
        },
      });
    }

    if (prismaError.code === "P2025") {
      return res.status(404).json({
        error: {
          message: "Record not found",
          code: "NOT_FOUND",
          statusCode: 404,
        },
      });
    }
  }

  // Handle unknown errors
  const statusCode = 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  return res.status(statusCode).json({
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

