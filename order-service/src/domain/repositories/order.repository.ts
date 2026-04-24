import { Order } from "../entities/order.entity";

export interface IOrderRepository {
  findOrderByUserId(userId: string): Promise<Order[] | null>;
}
