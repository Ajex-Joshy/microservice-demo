import pino from "pino";
import "dotenv/config";
import { getCorrelationId } from "@shared/tracing/tracing-context";

const ENV = { NODE_ENV: process.env.NODE_ENV || "development" };

export const logger = pino({
	level: ENV.NODE_ENV === "production" ? "info" : "debug",
	mixin() {
		const correlationId = getCorrelationId();
		return correlationId ? { correlationId } : {};
	},
	...(ENV.NODE_ENV !== "production"
		? {
				transport: {
					target: "pino-pretty",
					options: {
						colorize: true,
					},
				},
			}
		: {}),
});
