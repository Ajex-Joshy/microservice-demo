import type { Order } from "../entities/order.entity";
import type { OrderStatus } from "../value-objects/order-status.vo";

export interface IOrderRepository {
	create(order: Order): Promise<Order>;
	findByUserId(userId: string): Promise<Order[]>;
	findById(id: string): Promise<Order | null>;
	updateStatus(id: string, status: OrderStatus): Promise<Order>;
}
