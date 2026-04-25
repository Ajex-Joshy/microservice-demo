import { status } from "@grpc/grpc-js";
import { HTTP_STATUS } from "@shared/constants/http-status.constants";
import { BaseException } from "@shared/exceptions/BaseException";

export class InvalidCredentialsException extends BaseException {
  constructor() {
    super(
      "Invalid credentials",
      "INVALID_CREDENTIALS",
      HTTP_STATUS.UNAUTHORIZED,
      status.UNAUTHENTICATED,
    );
  }
}
