import { Router } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "@config/di/types";
import { OrderController } from "../controllers/order.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validation.middleware";
import { createOrderSchema, updateOrderStatusSchema } from "../validators/order.validators";

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
    this.router.post(
      "/orders",
      this.authMiddleware.handle,
      validateRequest(createOrderSchema),
      this.controller.create
    );

    this.router.get(
      "/orders/my",
      this.authMiddleware.handle,
      this.controller.getByUser
    );

    this.router.get(
      "/orders/:id",
      this.authMiddleware.handle,
      this.controller.getById
    );

    this.router.patch(
      "/orders/:id/status",
      this.authMiddleware.handle,
      validateRequest(updateOrderStatusSchema),
      this.controller.updateStatus
    );
  }
}
