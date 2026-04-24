import { Container } from "inversify";
import { GetUserById } from "../../application/use-cases/get-user-by-id.use-case";
import { LoginUser } from "../../application/use-cases/login-user.use-case";
import { RegisterUser } from "../../application/use-cases/register-user.use-case";
import { JwtService } from "../../infrastructure/auth/jwt.service";
import { PasswordService } from "../../infrastructure/auth/password.service";
import { MongoUserRepository } from "../../infrastructure/db/repositories/mongo-user.repository";
import { AuthController } from "../../interfaces/http/controllers/auth.controller";
import { AuthMiddleware } from "../../interfaces/http/middlewares/auth.middlware";
import { RoleMiddleware } from "../../interfaces/http/middlewares/role.middleware";
import { AuthRoutes } from "../../interfaces/http/routes/auth.routes";
import { TYPES } from "./types";

const container = new Container();

// infra
container.bind(TYPES.UserRepository).to(MongoUserRepository);
container.bind(TYPES.PasswordService).to(PasswordService);
container.bind(TYPES.JwtService).to(JwtService);

// use-cases
container.bind(TYPES.RegisterUser).to(RegisterUser);
container.bind(TYPES.LoginUser).to(LoginUser);
container.bind(TYPES.GetUserById).to(GetUserById);

// controllers
container.bind(TYPES.AuthController).to(AuthController);

// middlewares
container.bind(TYPES.AuthMiddleware).to(AuthMiddleware);
container.bind(TYPES.RoleMiddleware).to(RoleMiddleware);

// routes
container.bind(TYPES.AuthRoutes).to(AuthRoutes);

export { container };
