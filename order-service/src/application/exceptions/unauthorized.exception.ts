import { status } from "@grpc/grpc-js";
import { HTTP_STATUS } from "@shared/constants/http-status.constants";
import { BaseException } from "@shared/exceptions/BaseException";

export class UnauthorizedException extends BaseException {
	constructor(message = "Unauthorized access. Requires elevated privileges.") {
		super(
			message,
			"UNAUTHORIZED_ACCESS",
			HTTP_STATUS.FORBIDDEN,
			status.PERMISSION_DENIED,
			false,
		);
		Object.setPrototypeOf(this, UnauthorizedException.prototype);
	}
}
