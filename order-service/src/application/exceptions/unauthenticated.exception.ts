import { status } from "@grpc/grpc-js";
import { HTTP_STATUS } from "@shared/constants/http-status.constants";
import { BaseException } from "@shared/exceptions/BaseException";

export class UnauthenticatedException extends BaseException {
	constructor(message = "Unauthenticated: Valid token is required.") {
		super(
			message,
			"UNAUTHENTICATED",
			HTTP_STATUS.UNAUTHORIZED,
			status.UNAUTHENTICATED,
			false,
		);
		Object.setPrototypeOf(this, UnauthenticatedException.prototype);
	}
}
