import "reflect-metadata";
import express from "express";
import { container } from "./src/config/di/container";
import { ENV } from "./src/config/env.config";
import { connectDB, disconnectDB } from "./src/infrastructure/db/mongo";
import { errorHandler } from "./src/interfaces/http/middlewares/error-handler.middleware";
import type { AuthRoutes } from "./src/interfaces/http/routes/auth.routes";
import { TYPES } from "./src/config/di/types";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { httpLogger } from "./src/shared/logger/http.logger";
import { logger } from "./src/shared/logger/logger";

async function bootstrap() {
  await connectDB();

  const app = express();
  app.use(helmet());
  app.use(ExpressMongoSanitize({ replaceWith: "-" }));
  app.use(httpLogger);
  app.use(express.json());

  const authRoutes = container.get<AuthRoutes>(TYPES.AuthRoutes);

  app.use(authRoutes.router);

  app.use(errorHandler);

  const server = app.listen(ENV.PORT, () =>
    logger.info(`User service running on port: ${ENV.PORT}`),
  );

  // Graceful Shutdown
  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);

    server.close(async () => {
      logger.info("HTTP server closed.");
      await disconnectDB();
      logger.info("Graceful shutdown complete.");
      process.exit(0);
    });

    // Force shutdown if it takes too long
    setTimeout(() => {
      logger.error(
        "Could not close connections in time, forcefully shutting down",
      );
      process.exit(1);
    }, 10000);
  };

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
}

bootstrap().catch((err) => {
  logger.error(err, "Failed to start server:");
  process.exit(1);
});
