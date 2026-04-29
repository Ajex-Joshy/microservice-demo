import { ENV } from "@config/env.config";
import pino from "pino";
import { getCorrelationId } from "../tracing/tracing-context";

export const logger = pino({
  level: ENV.NODE_ENV === "production" ? "info" : "debug",
  mixin() {
    const correlationId = getCorrelationId();
    return correlationId ? { correlationId } : {};
  },
  ...(ENV.NODE_ENV !== "production"
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      }
    : {}),
});
