import type { IOrderRepository } from "@domain/repositories/order.repository";
import { OrderMapper } from "../mappers/order.mapper";
import { OrderResponseDTO } from "@application/dto/order-response.dto";

export class GetOrderById {
	constructor(private repo: IOrderRepository) { }

	async execute(orderId: string): Promise<OrderResponseDTO | null> {
		const order = await this.repo.findById(orderId);
		if (!order) return null;

		return OrderMapper.toDTO(order);
	}
}
