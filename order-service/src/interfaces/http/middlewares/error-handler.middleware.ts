import { logger } from "@shared/logger/logger";
import type { NextFunction, Request, Response } from "express";

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	_next: NextFunction,
) => {
	const status = err.httpStatus || 500;
	const isServerError = status >= 500;

	if (isServerError) {
		logger.error(
			{
				err,
				method: req.method,
				url: req.originalUrl,
				body: req.body,
				user: (req as any).user?.userId,
			},
			"Unhandled server error",
		);
	} else {
		logger.warn(
			{
				message: err.message,
				method: req.method,
				url: req.originalUrl,
			},
			"Client error",
		);
	}

	res.status(status).json({
		success: false,
		message: isServerError ? "Internal Server Error" : err.message,
		code: err.code || "UNKNOWN_ERROR",
	});
};
