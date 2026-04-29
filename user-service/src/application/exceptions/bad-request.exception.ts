import { status } from "@grpc/grpc-js";
import { HTTP_STATUS } from "@shared/constants/http-status.constants";
import { BaseException } from "@shared/exceptions/BaseException";

export class BadRequestException extends BaseException {
  constructor(message: string = "Bad Request", details?: any) {
    super(
      message,
      "BAD_REQUEST",
      HTTP_STATUS.BAD_REQUEST,
      status.INVALID_ARGUMENT,
      details,
    );
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}
