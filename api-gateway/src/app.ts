import logger from "@config/logger.config";
import { correlationIdMiddleware } from "@middlewares/correlation-id.middleware";
import { errorMiddleware } from "@middlewares/error.middleware";
import { rateLimiter } from "@middlewares/rate-limiter.middleware";
import { requestLoggerMiddleware } from "@middlewares/request-logger.middleware";
import { ProxyService } from "@proxy/proxy.service";
import routes from "@routes/index";
import { HTTP_STATUS } from "@utils/http-status";
import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import helmet from "helmet";

const createApp = (): Application => {
  const app = express();

  // Security headers
  app.use(helmet());
  app.use(cors());

  // Correlation ID tracking
  app.use(correlationIdMiddleware);

  // Rate limiting
  app.use(rateLimiter);

  // Request logging
  app.use(requestLoggerMiddleware);

  // Body parsing (Lenient type check for compatibility)
  app.use(express.json({ type: "*/*" }));

  // Initialize Proxy Services
  ProxyService.setupProxy(app);

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
