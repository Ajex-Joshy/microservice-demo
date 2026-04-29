import { Request, Response, NextFunction } from "express";
import logger from "@config/logger.config";
import { HTTP_STATUS } from "@utils/http-status";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";
  const correlationId = (req as any).correlationId;

  logger.error(`[Error] ${status} - ${message}`, {
    url: req.url,
    method: req.method,
    correlationId,
    stack: err.stack,
  });

  res.status(status).json({
    message,
    status,
    timestamp: new Date().toISOString(),
    correlationId,
  });
};
