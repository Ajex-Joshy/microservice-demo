import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "@config/di/types";
import { CreateOrder } from "@application/use-cases/create-order.use-case";
import { GetOrderById } from "@application/use-cases/get-order-by-id.use-case";
import { GetOrderByUser } from "@application/use-cases/get-order-by-user.use-case";
import { UpdateOrderStatus } from "@application/use-cases/update-order-status.use-case";
import { AuthRequest } from "../middlewares/auth.middleware";

@injectable()
export class OrderController {
  constructor(
    @inject(TYPES.CreateOrder) private createOrderUC: CreateOrder,
    @inject(TYPES.GetOrderById) private getOrderByIdUC: GetOrderById,
    @inject(TYPES.GetOrderByUser) private getOrderByUserUC: GetOrderByUser,
    @inject(TYPES.UpdateOrderStatus) private updateOrderStatusUC: UpdateOrderStatus
  ) {}

  create = async (req: AuthRequest, res: Response) => {
    const { item, quantity, price } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const order = await this.createOrderUC.execute(userId, item, quantity, price);
    res.status(201).json({ success: true, data: order });
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await this.getOrderByIdUC.execute(id as string);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  };

  getByUser = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    const orders = await this.getOrderByUserUC.execute(userId);
    res.status(200).json({ success: true, data: orders });
  };

  updateStatus = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({ success: false, message: "Admin not authenticated" });
    }

    const order = await this.updateOrderStatusUC.execute(id as string, status, adminId);
    res.status(200).json({ success: true, data: order });
  };
}
