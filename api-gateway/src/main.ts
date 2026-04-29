import { app } from "./app";
import { ENV } from "@config/env.config";
import logger from "@config/logger.config";

const startServer = () => {
  try {
    const server = app.listen(ENV.PORT, () => {
      logger.info(`${ENV.SERVICE_NAME} running on port: ${ENV.PORT}`);
      logger.info(`Environment: ${ENV.NODE_ENV}`);
    });

    // Graceful Shutdown handler
    let isShuttingDown = false;

    const gracefulShutdown = async (signal: string) => {
      if (isShuttingDown) return;
      isShuttingDown = true;

      logger.info(`Received ${signal}. Shutting down gracefully...`);

      const timeout = setTimeout(() => {
        logger.error("Force shutdown due to timeout");
        process.exit(1);
      }, 10000);

      server.close(() => {
        logger.info("HTTP server closed.");
        logger.info("Graceful shutdown complete.");
        clearTimeout(timeout);
        process.exit(0);
      });
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Promise Rejection:", err);
});

startServer();
