import "reflect-metadata";
import express from "express";
import { container } from "./src/container/container";
import { ENV } from "./src/infrastructure/config/env.config";
import { connectDB } from "./src/infrastructure/db/mongo";
import { errorHandler } from "./src/interfaces/http/middlewares/error-handler.middleware";
import type { AuthRoutes } from "./src/interfaces/http/routes/auth.routes";
import { TYPES } from "./src/types";
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

  app.listen(ENV.PORT, () =>
    logger.info(`User service running on port: ${ENV.PORT}`),
  );
}

bootstrap().catch((err) => {
  logger.error(err, "Failed to start server:");
  process.exit(1);
});
