import { UnauthenticatedException } from "@application/exceptions/unauthenticated.exception";
import { TYPES } from "@config/di/types";
import type { UserRole } from "@domain/entities/user.entity";
import type { JwtService } from "@infrastructure/auth/jwt.service";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

export interface AuthRequest extends Request {
  user?: { userId: string; role: UserRole };
}

@injectable()
export class AuthMiddleware {
  constructor(@inject(TYPES.JwtService) private jwt: JwtService) {}

  handle = (req: AuthRequest, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) return next(new UnauthenticatedException());

    const token = header.split(" ")[1];
    if (!token) return next(new UnauthenticatedException());

    try {
      const payload = this.jwt.verify(token) as {
        userId: string;
        role: UserRole;
      };
      req.user = { userId: payload.userId, role: payload.role };

      next();
    } catch {
      next(new UnauthenticatedException());
    }
  };
}
