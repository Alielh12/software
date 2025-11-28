import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env" : ".env" });

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  AUTH_STRATEGY: z.enum(["jwt", "firebase"]).default("jwt"),
  FIREBASE_PROJECT_ID: z.string().optional(),
  OPENAI_API_KEY: z.string().optional()
});

const env = envSchema.parse(process.env);

export default env;
