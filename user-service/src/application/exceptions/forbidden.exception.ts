import { status } from "@grpc/grpc-js";
import { HTTP_STATUS } from "../../shared/constants/http-status.constants";
import { BaseException } from "../../shared/exceptions/BaseException";

export class ForbiddenException extends BaseException {
  constructor(message = "Forbidden") {
    super(message, "FORBIDDEN", HTTP_STATUS.FORBIDDEN, status.PERMISSION_DENIED);
    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }
}
