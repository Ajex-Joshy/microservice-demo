import "reflect-metadata";
import express from "express";
import helmet from "helmet";
import { container } from "@config/di/container";
import { TYPES } from "@config/di/types";
import { ENV } from "@config/env.config";
import { OrderRoutes } from "@interfaces/http/routes/order.routes";
import { errorHandler } from "@interfaces/http/middlewares/error-handler.middleware";
import { tracingMiddleware } from "@interfaces/http/middlewares/tracing.middleware";
import { httpLogger } from "@shared/logger/http.logger";
import { logger } from "@shared/logger/logger";
import { disconnectDB } from "@infrastructure/db/prisma/prisma.client";

async function bootstrap() {
  const app = express();

  app.use(helmet());
  app.use(tracingMiddleware);
  app.use(httpLogger);
  app.use(express.json());

  const orderRoutes = container.get<OrderRoutes>(TYPES.OrderRoutes);
  app.use(orderRoutes.router);

  app.use(errorHandler);

  const server = app.listen(ENV.PORT, () => {
    logger.info(`Order Service running on port ${ENV.PORT}`);
  });

  // Graceful Shutdown
  let isShuttingDown = false;

  const gracefulShutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.info(`Received ${signal}. Shutting down gracefully...`);

    const timeout = setTimeout(() => {
      logger.error("Force shutdown due to timeout");
      process.exit(1);
    }, 10000);

    server.close(async () => {
      try {
        logger.info("HTTP server closed.");
        await disconnectDB();
        logger.info("Database connection closed.");
        logger.info("Graceful shutdown complete.");
        process.exit(0);
      } catch (err) {
        logger.error(err, "Error during graceful shutdown");
        process.exit(1);
      } finally {
        clearTimeout(timeout);
      }
    });
  };

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
}

bootstrap().catch((err) => {
  logger.error(err, "Failed to start Order Service");
  process.exit(1);
});
