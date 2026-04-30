import "dotenv/config";
import { z } from "zod";

export const envSchema = z.object({
	PORT: z
		.string()
		.optional()
		.transform((val) => (val ? Number(val) : 3001)),

	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

	JWT_SECRET: z.string().min(1).default("default_secret"),

	USER_SERVICE_URL: z.string().default("127.0.0.1:50051"),
});

export const ENV = envSchema.parse(process.env);
