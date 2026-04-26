import { string, z } from "zod";
import "dotenv/config";
import pkg from "../../package.json" with { type: "json" };

const envSchema = z.object({
  PORT: z.string(),
  NODE_ENV: z.string().default("development"),

  AUTH_JWT_SECRET: z.string().min(10),
  AUTH_JWT_EXPIRES_IN: string().default("1h"),

  RATE_LIMIT_WINDOW: z.string().default("15"),
  RATE_LIMIT_MAX_REQUESTS: z.string().default("100"),

  DEFAULT_TIMEOUT: z.string().default("3000"),

  LOG_LEVEL: z.string().default("debug"),

  SERVICE_NAME: z.string().default(pkg.name),

  USER_SERVICE_URL: z.string().default("http://localhost:3001"),
  ORDER_SERVICE_URL: z.string().default("http://localhost:3002"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(parsed.error);
  process.exit(1);
}

export const ENV = parsed.data;
