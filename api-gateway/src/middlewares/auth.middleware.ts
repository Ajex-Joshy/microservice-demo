import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "@config/env.config.js";
import { HTTP_STATUS } from "@shared/constants/http-status.constants.js";
import { UserPayload } from "@shared/types/auth.types.js";
import logger from "@config/logger.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn(`Unauthorized access attempt: No Bearer token provided for ${req.path}`);
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: "Unauthenticated: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: "Unauthenticated: Token format invalid" });
  }

  try {
    const decoded = jwt.verify(token, ENV.AUTH_JWT_SECRET) as UserPayload;
    (req as any).user = decoded;
    next();
  } catch (error) {
    logger.error("JWT Verification failed", error);
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: "Unauthenticated: Invalid or expired token" });
  }
};
