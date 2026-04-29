import { status } from "@grpc/grpc-js";
import { HTTP_STATUS } from "@shared/constants/http-status.constants";
import { BaseException } from "@shared/exceptions/BaseException";

export class OrderValidationException extends BaseException {
	constructor(message: string) {
		super(
			message,
			"ORDER_VALIDATION_ERROR",
			HTTP_STATUS.BAD_REQUEST,
			status.INVALID_ARGUMENT,
		);
		Object.setPrototypeOf(this, OrderValidationException.prototype);
	}
}
