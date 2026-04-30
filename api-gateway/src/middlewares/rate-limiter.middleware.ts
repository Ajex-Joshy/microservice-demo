import { ENV } from "@config/env.config";
import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: Number(ENV.RATE_LIMIT_WINDOW),
  max: Number(ENV.RATE_LIMIT_MAX_REQUESTS),
});
