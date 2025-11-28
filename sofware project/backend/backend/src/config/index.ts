import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || "4000", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  // Database
  databaseUrl: process.env.DATABASE_URL || "",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",

  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),

  // Security
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || "10", 10),

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",

  // Encryption (for medical records)
  encryptionKey: process.env.ENCRYPTION_KEY || "",

  // Chatbot Service
  chatbotServiceUrl: process.env.CHATBOT_SERVICE_URL || "http://localhost:8001",

  // File Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10), // 10MB
  allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || "pdf,doc,docx,jpg,jpeg,png").split(","),
};

// Validate required config
const requiredConfig = ["DATABASE_URL", "JWT_SECRET"];

if (config.nodeEnv === "production") {
  requiredConfig.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });
}

