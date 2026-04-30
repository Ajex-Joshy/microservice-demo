import { UnauthenticatedException } from "@application/exceptions/unauthenticated.exception";
import type { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";

export interface AuthRequest extends Request {
	user?: { userId: string; role: string };
}

@injectable()
export class AuthMiddleware {
	handle = (req: AuthRequest, _res: Response, next: NextFunction) => {
		const userId = req.headers["x-user-id"] as string;
		const role = (req.headers["x-user-role"] as string) || "USER";

		if (!userId) {
			return next(new UnauthenticatedException());
		}

		req.user = { userId, role };
		next();
	};
}
