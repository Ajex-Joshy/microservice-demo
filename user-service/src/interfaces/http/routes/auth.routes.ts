import { Router } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../config/di/types";
import type { AuthController } from "../controllers/auth.controller";
import type { AuthMiddleware } from "../middlewares/auth.middlware";
import type { RoleMiddleware } from "../middlewares/role.middleware";

@injectable()
export class AuthRoutes {
  public router: Router;

  constructor(
    @inject(TYPES.AuthController) private controller: AuthController,
    @inject(TYPES.AuthMiddleware) private auth: AuthMiddleware,
    @inject(TYPES.RoleMiddleware) private role: RoleMiddleware,
  ) {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.post("/auth/register", this.controller.registerUser);

    this.router.post("/auth/login", this.controller.loginUser);

    this.router.get("/auth/me", this.auth.handle, this.controller.me);

    this.router.get(
      "/users/:id",
      this.auth.handle,
      this.role.handle("USER"),
      this.controller.getUserById,
    );
  }
}
