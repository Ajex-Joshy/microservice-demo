import { Order } from "../../../domain/entities/order.entity";
import type { IOrderRepository } from "../../../domain/repositories/order.repository";
import { prisma } from "./prisma.client";

export class PrismaOrderRepository implements IOrderRepository {
  async findOrderByUserId(userId: string): Promise<Order[] | null> {
    try {
      const data = await prisma.order.findMany({
        where: { userId },
      });
      return data.map(
        (o: any) => new Order(o.id, o.userId, o.product, o.quantity),
      );
    } catch (error) {
      throw new Error("Database error in fetching orders");
    }
  }
}
