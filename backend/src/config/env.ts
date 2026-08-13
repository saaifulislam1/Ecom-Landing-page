import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16).default("replace_with_secure_secret"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  APP_URL: z.string().default("http://localhost:5000"),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().default("PlugCommerce <onboarding@resend.dev>"),
});

export const env = envSchema.parse(process.env);
