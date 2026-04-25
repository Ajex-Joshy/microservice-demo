import { ForbiddenException } from "@application/exceptions/forbidden.exception";
import type { AuthRequest } from "@interfaces/http/middlewares/auth.middlware";
import type { NextFunction, Response } from "express";
import { injectable } from "inversify";

@injectable()
export class RoleMiddleware {
  handle(role: string) {
    return (req: AuthRequest, _res: Response, next: NextFunction) => {
      if (!req.user || req.user.role !== role) {
        return next(new ForbiddenException("Forbidden"));
      }
      next();
    };
  }
}
