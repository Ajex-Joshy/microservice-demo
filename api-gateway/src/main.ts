import { app } from "./app.js";
import { ENV } from "@config/env.config.js";
import logger from "@config/logger.js";

const startServer = () => {
  try {
    app.listen(ENV.PORT, () => {
      logger.info(`${ENV.SERVICE_NAME} running on port: ${ENV.PORT}`);
      logger.info(`Environment: ${ENV.NODE_ENV}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Promise Rejection:", err);
  // In production, you might want to exit gracefully
  // process.exit(1);
});

startServer();
