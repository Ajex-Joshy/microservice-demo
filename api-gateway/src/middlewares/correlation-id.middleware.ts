import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export const CORRELATION_HEADER = "x-correlation-id";

export const correlationIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const correlationId = (req.headers[CORRELATION_HEADER] as string) || randomUUID();
  
  // Attach to request object for easy access
  (req as any).correlationId = correlationId;
  
  // Set header in response so client can track it
  res.setHeader(CORRELATION_HEADER, correlationId);
  
  next();
};
