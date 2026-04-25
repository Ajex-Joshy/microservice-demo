import { TYPES } from "@config/di/types";
import { inject, injectable } from "inversify";
import type { GetUserById } from "@application/use-cases/get-user-by-id.use-case";
import { UserNotFoundException } from "@domain/exceptions/UserNotFound.exception";

@injectable()
export class UserGrpcController {
  constructor(@inject(TYPES.GetUserById) private getUserById: GetUserById) { }

  GetUser = async (call: any, callback: any) => {
    try {
      const { userId } = call.request;
      const user = await this.getUserById.execute(userId);

      if (!user) {
        return callback({
          code: 5, // NOT_FOUND
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
          code: 5,
          message: error.message,
        });
      }
      callback({
        code: 13, // INTERNAL
        message: "Internal server error",
      });
    }
  };
}
