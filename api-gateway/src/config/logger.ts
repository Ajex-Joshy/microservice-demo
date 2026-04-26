import winston from "winston";
import { ENV } from "./env.config.js";

const logger = winston.createLogger({
  level: ENV.LOG_LEVEL,
  defaultMeta: { service: ENV.SERVICE_NAME },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, service }) => {
      return `[${timestamp}]  [${level}]  [${service}]  [${message}]`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
