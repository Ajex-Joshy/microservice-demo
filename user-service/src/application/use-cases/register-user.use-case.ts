import { TYPES } from "@config/di/types";
import { User, UserRole } from "@domain/entities/user.entity";
import { UserAlreadyExistsException } from "@domain/exceptions/UserAlreadyExists.exception";
import type { IUserRepository } from "@domain/repositories/user.repository.interface";
import type { PasswordService } from "@infrastructure/auth/password.service";
import { inject, injectable } from "inversify";

@injectable()
export class RegisterUser {
  constructor(
    @inject(TYPES.UserRepository) private repo: IUserRepository,
    @inject(TYPES.PasswordService) private password: PasswordService,
  ) {}

  async execute(
    name: string,
    email: string,
    password: string,
    role: UserRole = UserRole.USER,
  ) {
    const exists = await this.repo.findByEmail(email);

    if (exists) throw new UserAlreadyExistsException(email);

    const hashed = await this.password.hash(password);

    return this.repo.create(new User("", name, email, hashed, role));
  }
}
