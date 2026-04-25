import { BaseException } from "../../../shared/exceptions/BaseException";
import { HTTP_STATUS } from "../../../shared/constants/http-status.constants";

export const mapErrorToHttp = (error: unknown) => {
  if (error instanceof BaseException && error.isOperational) {
    return {
      status: error.httpStatus,
      message: error.message,
      code: error.code,
    };
  }

  // DEFAULT FALLBACK (Non-Operational / Unhandled)
  return {
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: "Internal Server Error",
    code: "INTERNAL_ERROR",
  };
};
