import { UnauthenticatedException } from "@application/exceptions/unauthenticated.exception";
import type { UserRole } from "@domain/entities/user.entity";
import type { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";

export interface AuthRequest extends Request {
  user?: { userId: string; role: UserRole };
}

@injectable()
export class AuthMiddleware {
  handle = (req: AuthRequest, _res: Response, next: NextFunction) => {
    const userId = req.headers["x-user-id"] as string;
    const role = (req.headers["x-user-role"] as UserRole) || "USER";

    if (!userId) {
      return next(new UnauthenticatedException());
    }

    req.user = { userId, role };
    next();
  };
}
