import { config } from "dotenv";
import z from "zod";

config();

const schema = z.object({
  PORT: z.string(),
  MONGO_URI: z.string(),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRY: z.string().regex(/^\d+(s|m|h|d)$/, "Invalid JWT expiry format"),
  NODE_ENV: z.string().default("development"),
  GRPC_PORT: z.string(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(parsed.error.format());

  process.exit(1);
}

export const ENV = parsed.data;
