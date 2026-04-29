import { TYPES } from "@config/di/types";
import { inject, injectable } from "inversify";
import type { GetUserById } from "@application/use-cases/get-user-by-id.use-case";
import { UserNotFoundException } from "@domain/exceptions/UserNotFound.exception";
import * as grpc from "@grpc/grpc-js";
import type { UserServiceHandlers } from "../generated/user/UserService";

@injectable()
export class UserGrpcController {
  constructor(@inject(TYPES.GetUserById) private getUserById: GetUserById) { }

  GetUser: UserServiceHandlers["GetUser"] = async (call, callback) => {
    try {
      const { userId } = call.request;
      const user = await this.getUserById.execute(userId);

      if (!user) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: "User not found",
        });
      }

      callback(null, {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: error.message,
        });
      }
      callback({
        code: grpc.status.INTERNAL,
        message: "Internal server error",
      });
    }
  };
}
