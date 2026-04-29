import { logger } from "@shared/logger/logger";
import pinoHttp from "pino-http";

export const httpLogger = pinoHttp({
  logger,
});
