import { symbol } from "zod";

export const TYPES = {
  // infra
  UserRepository: Symbol.for("UserRepository"),
  PasswordService: Symbol.for("PasswordService"),
  JwtService: Symbol.for("JwtService"),

  // usecases
  RegisterUser: Symbol.for("RegisterUser"),
  LoginUser: Symbol.for("LoginUser"),
  GetUserById: Symbol.for("GetUserById"),

  // controllers
  AuthController: Symbol.for("AuthController"),

  //middlewares
  AuthMiddleware: Symbol.for("AuthMiddleware"),
  RoleMiddleware: Symbol.for("RoleMiddleware"),

  // routes
  AuthRoutes: Symbol.for("AuthRoutes"),

  // gRPC controllers
  UserGrpcController: Symbol.for("UserGrpcController"),
};
