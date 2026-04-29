import "reflect-metadata";
import { container } from "@config/di/container";
import { TYPES } from "@config/di/types";
import { ENV } from "@config/env.config";
import { connectDB, disconnectDB } from "@infrastructure/db/mongo";
import {
  server as grpcServer,
  startGrpcServer,
} from "@interfaces/grpc/user.grpc.server";
import { errorHandler } from "@interfaces/http/middlewares/error-handler.middleware";
import { tracingMiddleware } from "@interfaces/http/middlewares/tracing.middleware";
import type { AuthRoutes } from "@interfaces/http/routes/auth.routes";
import { httpLogger } from "@shared/logger/http.logger";
import { logger } from "@shared/logger/logger";
import express from "express";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";

async function bootstrap() {
  await connectDB();
  await startGrpcServer();

  const app = express();
  app.use(helmet());
  // app.use(ExpressMongoSanitize({ replaceWith: "-" }));
  app.use(tracingMiddleware);
  app.use(httpLogger);
  app.use(express.json());

  const authRoutes = container.get<AuthRoutes>(TYPES.AuthRoutes);

  app.use(authRoutes.router);

  app.use(errorHandler);

  const server = app.listen(ENV.PORT, () =>
    logger.info(`User service running on port: ${ENV.PORT}`),
  );

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
    grpcServer.tryShutdown((err: any) => {
      if (err) {
        logger.error(err, "Error shutting down gRPC server");
      } else {
        logger.info("gRPC server closed");
      }
    });
    server.close(async () => {
      try {
        logger.info("HTTP server closed.");
        await disconnectDB();
        logger.info("Graceful shutdown complete.");
        process.exit(0);
      } catch (err) {
        logger.error(err, "Error during shutdown");
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
  logger.error(err, "Failed to start server:");
  process.exit(1);
});
