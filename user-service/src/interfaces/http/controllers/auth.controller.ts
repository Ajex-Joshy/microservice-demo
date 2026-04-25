import { UserResponseDTO } from "@application/dto/UserResponse.dto";
import type { GetUserById } from "@application/use-cases/get-user-by-id.use-case";
import type { LoginUser } from "@application/use-cases/login-user.use-case";
import type { RegisterUser } from "@application/use-cases/register-user.use-case";
import { TYPES } from "@config/di/types";
import { UserNotFoundException } from "@domain/exceptions/UserNotFound.exception";
import type { JwtService } from "@infrastructure/auth/jwt.service";
import { HTTP_STATUS } from "@shared/constants/http-status.constants";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.RegisterUser) private register: RegisterUser,
    @inject(TYPES.LoginUser) private login: LoginUser,
    @inject(TYPES.GetUserById) private getUser: GetUserById,
    @inject(TYPES.JwtService) private jwt: JwtService,
  ) {}

  // POST /auth/register
  registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.register.execute(
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.role,
      );

      // never return password
      const response = new UserResponseDTO(user._id, user.name, user.email);
      const token = this.jwt.generate(user._id, user.role);

      res.status(HTTP_STATUS.CREATED).json({
        user: response,
        token,
      });
    } catch (err) {
      next(err);
    }
  };

  // POST /auth/login
  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await this.login.execute(req.body.email, req.body.password);

      res.json({ token });
    } catch (err) {
      next(err);
    }
  };

  // GET /users/:id
  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const user = await this.getUser.execute(userId);
      if (!user) throw new UserNotFoundException(userId);

      const response = new UserResponseDTO(user._id, user?.name, user.email);

      res.json(response);
    } catch (err) {
      next(err);
    }
  };
  // GET /auth/me
  me = async (
    req: Request & { user?: { userId: string } },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UserNotFoundException(userId ?? "unknown");

      const user = await this.getUser.execute(userId);
      if (!user) throw new UserNotFoundException(userId);

      const response = new UserResponseDTO(user._id, user?.name, user.email);

      res.json(response);
    } catch (err) {
      next(err);
    }
  };
}
