import type { NextFunction, Request, Response } from "express";
import { mapErrorToHttp } from "../error/ErrorMapper";
import { logger } from "../../../shared/logger/logger";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const e = mapErrorToHttp(err);

  if (e.status >= 500) {
    logger.error(err, "Unhandled Server Error:");
  }

  res.status(e.status).json({
    message: e.message,
    code: e.code,
  });
};
