import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import pino from "pino";
import pinoHttp from "pino-http";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { config } from "./config";
import { errorHandler } from "./middlewares/errorHandler";
import { rateLimiter } from "./middlewares/rateLimiter";
import { authRoutes } from "./routes/auth.routes";
import { appointmentRoutes } from "./routes/appointments.routes";
import { recordsRoutes } from "./routes/records.routes";
import { emergencyRoutes } from "./routes/emergency.routes";
import { chatbotRoutes } from "./routes/chatbot.routes";
import { healthRoutes } from "./routes/health.routes";

dotenv.config();

// Initialize logger
export const logger = pino({
  level: config.logLevel,
  transport:
    config.nodeEnv === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CareConnect API",
      version: "1.0.0",
      description: "University Health Center Management System API",
      contact: {
        name: "API Support",
        email: "api@careconnect.example.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: "Development server",
      },
      {
        url: "https://api.careconnect.example.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export function createApp(): Express {
  const app = express();

  // Trust proxy (for rate limiting behind reverse proxy)
  app.set("trust proxy", 1);

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Utility middleware
  app.use(compression());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // HTTP request logging with Pino
  app.use(
    pinoHttp({
      logger,
      autoLogging: {
        ignore: (req) => req.url === "/api/health",
      },
    })
  );

  // Swagger documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Rate limiting
  app.use("/api/", rateLimiter);

  // Health check (no auth required)
  app.use("/api/health", healthRoutes);

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/appointments", appointmentRoutes);
  app.use("/api/records", recordsRoutes);
  app.use("/api/emergency", emergencyRoutes);
  app.use("/api/chatbot", chatbotRoutes);

  // Error handling
  app.use(errorHandler);

  // 404 handler
  app.use((req, res) => {
    logger.warn({ url: req.url, method: req.method }, "Route not found");
    res.status(404).json({
      error: "Route not found",
      path: req.url,
    });
  });

  return app;
}

export function startServer(): void {
  const app = createApp();

  const server = app.listen(config.port, () => {
    logger.info(
      {
        port: config.port,
        environment: config.nodeEnv,
      },
      "🚀 Server started successfully"
    );
    logger.info(`📚 API Documentation: http://localhost:${config.port}/api-docs`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    logger.info("SIGTERM received, shutting down gracefully");
    server.close(() => {
      logger.info("Process terminated");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    logger.info("SIGINT received, shutting down gracefully");
    server.close(() => {
      logger.info("Process terminated");
      process.exit(0);
    });
  });
}

// Start server if this file is executed directly
if (require.main === module) {
  startServer();
}

export default createApp;

