import { BadRequestException } from "@application/exceptions/bad-request.exception";
import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export const validateRequest = <T>(schema: ZodSchema<T>) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			const errors = result.error.issues.map((i) => ({
				path: i.path.join("."),
				message: i.message,
			}));

			return next(new BadRequestException("Validation failed", errors));
		}

		req.body = result.data;
		next();
	};
};
