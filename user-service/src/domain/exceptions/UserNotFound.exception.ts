import { status } from "@grpc/grpc-js";
import { HTTP_STATUS } from "../../shared/constants/http-status.constants";
import { BaseException } from "../../shared/exceptions/BaseException";

export class UserNotFoundException extends BaseException {
  constructor(id: string) {
    super(`User with id ${id} not found`, "USER_NOT_FOUND", HTTP_STATUS.NOT_FOUND, status.NOT_FOUND);
  }
}
