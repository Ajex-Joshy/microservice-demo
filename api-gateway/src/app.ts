import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { HTTP_STATUS } from "@shared/constants/http-status.constants.js";
import { rateLimiter } from "@middlewares/rate-limiter.middleware.js";
import { requestLogger } from "@middlewares/request-logger.middleware.js";
import { errorHandler } from "@middlewares/error-handler.middleware.js";
import { ProxyService } from "@proxy/proxy.service.js";
import routes from "@routes/index.js";
import logger from "@config/logger.js";

const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(cors());

  // Rate limiting
  app.use(rateLimiter);

  // Request logging
  app.use(requestLogger);

  app.use(express.json());

  // Mount application routes (health checks, etc.)
  app.use(routes);

  // Initialize Proxy Services
  ProxyService.setupProxy(app);

  // 404 handler
  app.use((req: Request, res: Response) => {
    logger.warn(`Resource not found: ${req.method} ${req.url}`);
    res.status(HTTP_STATUS.NOT_FOUND).json({
      message: "Resource not found",
      timestamp: new Date().toISOString(),
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

export const app = createApp();
