import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { tracingStorage } from "../../../shared/tracing/tracing-context";

export const CORRELATION_HEADER = "x-correlation-id";

export const tracingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const correlationId =
    (req.headers[CORRELATION_HEADER] as string) || randomUUID();

  // Set header in response as well
  res.setHeader(CORRELATION_HEADER, correlationId);

  // Run the rest of the request within the tracing context
  tracingStorage.run({ correlationId }, () => {
    next();
  });
};
