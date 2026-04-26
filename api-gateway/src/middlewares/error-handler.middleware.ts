import { Request, Response, NextFunction } from "express";
import logger from "@config/logger.js";
import { HTTP_STATUS } from "@shared/constants/http-status.constants.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error("Unhandled error", err);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
    timestamp: new Date().toISOString(),
  });
};
