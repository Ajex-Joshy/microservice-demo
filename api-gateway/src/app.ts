import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { HTTP_STATUS } from "@utils/http-status";
import { rateLimiter } from "@middlewares/rate-limiter.middleware";
import { requestLoggerMiddleware } from "@middlewares/request-logger.middleware";
import { errorMiddleware } from "@middlewares/error.middleware";
import routes from "@routes/index";
import { ProxyService } from "@proxy/proxy.service";
import logger from "@config/logger.config";

const createApp = (): Application => {
  const app = express();

  // Security headers
  app.use(helmet());
  app.use(cors());

  // Rate limiting
  app.use(rateLimiter);

  // Request logging
  app.use(requestLoggerMiddleware);

  // Initialize Proxy Services BEFORE body parsing
  // Proxied requests need the raw body stream — express.json() would consume it
  ProxyService.setupProxy(app);

  // Body parsing only for gateway's own routes (health, etc.)
  app.use(express.json());

  // Application routes (Health checks, etc.)
  app.use(routes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    logger.warn(`Resource not found: ${req.method} ${req.url}`);
    res.status(HTTP_STATUS.NOT_FOUND).json({
      message: "Resource not found",
      timestamp: new Date().toISOString(),
    });
  });

  // Global Error Handler
  app.use(errorMiddleware);

  return app;
};

export const app = createApp();
