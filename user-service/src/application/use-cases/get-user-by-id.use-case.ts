import { inject, injectable } from "inversify";
import type { User } from "../../domain/entities/user.entity";
import { UserNotFoundException } from "../../domain/exceptions/UserNotFound.exception";
import type { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { TYPES } from "../../config/di/types";

@injectable()
export class GetUserById {
  constructor(@inject(TYPES.UserRepository) private repo: IUserRepository) {}

  async execute(id: string): Promise<User | null> {
    const user = await this.repo.findById(id);
    if (!user) throw new UserNotFoundException(id);
    return user;
  }
}
