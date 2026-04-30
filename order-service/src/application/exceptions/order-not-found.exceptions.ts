import { status } from "@grpc/grpc-js";
import { HTTP_STATUS } from "@shared/constants/http-status.constants";
import { BaseException } from "@shared/exceptions/BaseException";

export class OrderNotFoundException extends BaseException {
	constructor(id: string) {
		super(
			`Order with id ${id} not found`,
			"ORDER_NOT_FOUND",
			HTTP_STATUS.NOT_FOUND,
			status.NOT_FOUND,
			false,
		);
		Object.setPrototypeOf(this, OrderNotFoundException.prototype);
	}
}
