import rateLimit from "express-rate-limit";
import { ENV } from "@config/env.config";
import { HTTP_STATUS } from "@utils/http-status";

export const rateLimiter = rateLimit({
  windowMs: Number(ENV.RATE_LIMIT_WINDOW),
  max: Number(ENV.RATE_LIMIT_MAX_REQUESTS),
});
