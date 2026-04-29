import { status } from "@grpc/grpc-js";
import { HTTP_STATUS } from "@shared/constants/http-status.constants";
import { BaseException } from "@shared/exceptions/BaseException";

export class DatabaseException extends BaseException {
	constructor(message: string) {
		super(
			message,
			"DATABASE_ERROR",
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
			status.INTERNAL,
			false,
		);
		Object.setPrototypeOf(this, DatabaseException.prototype);
	}
}
