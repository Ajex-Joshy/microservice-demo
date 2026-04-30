import type { OrderResponseDTO } from "@application/dto/order-response.dto";
import { TYPES } from "@config/di/types";
import type { IOrderRepository } from "@domain/repositories/order.repository";
import { inject, injectable } from "inversify";
import { OrderMapper } from "../mappers/order.mapper";

@injectable()
export class GetOrderById {
	constructor(@inject(TYPES.OrderRepository) private repo: IOrderRepository) {}

	async execute(orderId: string): Promise<OrderResponseDTO | null> {
		const order = await this.repo.findById(orderId);
		if (!order) return null;

		return OrderMapper.toDTO(order);
	}
}
