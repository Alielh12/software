import rateLimit from "express-rate-limit";
import { config } from "../config";
import { logger } from "../server";

export const rateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(
      {
        ip: req.ip,
        url: req.url,
        method: req.method,
      },
      "Rate limit exceeded"
    );
    res.status(429).json({
      error: {
        message: "Too many requests, please try again later.",
        code: "RATE_LIMIT_EXCEEDED",
        statusCode: 429,
      },
    });
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(
      {
        ip: req.ip,
        url: req.url,
      },
      "Auth rate limit exceeded"
    );
    res.status(429).json({
      error: {
        message: "Too many login attempts, please try again later.",
        code: "AUTH_RATE_LIMIT_EXCEEDED",
        statusCode: 429,
      },
    });
  },
});

