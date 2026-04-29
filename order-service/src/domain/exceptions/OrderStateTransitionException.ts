import { status } from "@grpc/grpc-js";
import { HTTP_STATUS } from "@shared/constants/http-status.constants";
import { BaseException } from "@shared/exceptions/BaseException";

export class OrderStateTransitionException extends BaseException {
	constructor(message: string, details?: any) {
		super(
			message,
			"ORDER_STATE_TRANSITION_ERROR",
			HTTP_STATUS.PRECONDITION_FAILED,
			status.FAILED_PRECONDITION,
			details,
		);
		Object.setPrototypeOf(this, OrderStateTransitionException.prototype);
	}
}
