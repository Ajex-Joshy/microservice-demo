import { Router } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "@config/di/types";
import { OrderController } from "../controllers/order.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validation.middleware";
import { createOrderSchema, updateOrderStatusSchema } from "../validators/order.validators";

import { checkHealth } from "@infrastructure/db/prisma/prisma.client";

@injectable()
export class OrderRoutes {
  public router: Router;

  constructor(
    @inject(TYPES.OrderController) private controller: OrderController,
    @inject(TYPES.AuthMiddleware) private authMiddleware: AuthMiddleware
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/health", async (req, res) => {
      const isHealthy = await checkHealth();
      res.json({ status: isHealthy ? "ok" : "error", database: isHealthy ? "connected" : "disconnected" });
    });

    this.router.post(
      "/",
      this.authMiddleware.handle,
      validateRequest(createOrderSchema),
      this.controller.create
    );

    this.router.get(
      "/my",
      this.authMiddleware.handle,
      this.controller.getByUser
    );

    this.router.get(
      "/:id",
      this.authMiddleware.handle,
      this.controller.getById
    );

    this.router.patch(
      "/:id/status",
      this.authMiddleware.handle,
      validateRequest(updateOrderStatusSchema),
      this.controller.updateStatus
    );
  }
}
