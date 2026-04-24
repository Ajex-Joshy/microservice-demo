import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../domain/repositories/user.repository.interface";
import type { JwtService } from "../../infrastructure/auth/jwt.service";
import type { PasswordService } from "../../infrastructure/auth/password.service";
import { TYPES } from "../../config/di/types";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials.exception";

@injectable()
export class LoginUser {
  constructor(
    @inject(TYPES.UserRepository) private repo: IUserRepository,
    @inject(TYPES.PasswordService) private password: PasswordService,
    @inject(TYPES.JwtService) private jwt: JwtService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new InvalidCredentialsException();

    const valid = await this.password.compare(password, user.passwordHash);
    if (!valid) throw new InvalidCredentialsException();

    return this.jwt.generate(user._id, user.role);
  }
}
