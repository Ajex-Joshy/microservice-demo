import { checkHealth } from "@infrastructure/db/mongo";
import { TYPES } from "@config/di/types";
import type { AuthController } from "@interfaces/http/controllers/auth.controller";
import type { AuthMiddleware } from "@interfaces/http/middlewares/auth.middlware";
import type { RoleMiddleware } from "@interfaces/http/middlewares/role.middleware";
import { Router } from "express";
import { inject, injectable } from "inversify";
import { validateRequest } from "../middlewares/validation.middleware";
import { LoginSchema } from "../validators/login.schema";
import { RegisterSchema } from "../validators/register.schema";

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
    this.router.get("/health", async (req, res) => {
      const isHealthy = await checkHealth();
      res.json({ status: isHealthy ? "ok" : "error", database: isHealthy ? "connected" : "disconnected" });
    });
    this.router.post(
      "/register",
      validateRequest(RegisterSchema),
      this.controller.registerUser,
    );

    this.router.post(
      "/login",
      validateRequest(LoginSchema),
      this.controller.loginUser,
    );

    this.router.get("/me", this.auth.handle, this.controller.me);

    this.router.get(
      "/:id",
      this.auth.handle,
      this.role.handle("USER"),
      this.controller.getUserById,
    );
  }
}
