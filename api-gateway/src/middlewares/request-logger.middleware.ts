import logger from "@config/logger.config";
import type { NextFunction, Request, Response } from "express";

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const correlationId = (req as any).correlationId;
    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
      {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration,
        correlationId,
      },
    );
  });

  next();
};
