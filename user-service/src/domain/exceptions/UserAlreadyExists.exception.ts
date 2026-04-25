import { status } from "@grpc/grpc-js";
import { HTTP_STATUS } from "@shared/constants/http-status.constants";
import { BaseException } from "@shared/exceptions/BaseException";

export class UserAlreadyExistsException extends BaseException {
  constructor(email: string) {
    super(
      `User with email ${email} already exists`,
      "USER_ALREADY_EXISTS",
      HTTP_STATUS.CONFLICT,
      status.ALREADY_EXISTS,
    );
  }
}
