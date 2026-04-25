import type { GetUserById } from "@application/use-cases/get-user-by-id.use-case";
import { TYPES } from "@config/di/types";
import { UserNotFoundException } from "@domain/exceptions/UserNotFound.exception";
import * as grpc from "@grpc/grpc-js";
import type {
  GetUserCall,
  GetUserCallback,
} from "@interfaces/grpc/types/user.grpc.types";
import { BaseException } from "@shared/exceptions/BaseException";
import { inject, injectable } from "inversify";

@injectable()
export class UserGrpcController {
  constructor(@inject(TYPES.GetUserById) private getUserById: GetUserById) {}

  GetUser = async (call: GetUserCall, callback: GetUserCallback) => {
    try {
      const { userId } = call.request;

      const user = await this.getUserById.execute(userId);

      if (!user) throw new UserNotFoundException(userId);

      return callback(null, {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      if (error instanceof BaseException && error.isOperational) {
        return callback({
          code: error.grpcStatus,
          message: error.message,
        } as grpc.ServiceError);
      }

      const message = error instanceof Error ? error.message : "Unknown error";

      return callback({
        code: grpc.status.INTERNAL,
        message,
      } as grpc.ServiceError);
    }
  };
}
