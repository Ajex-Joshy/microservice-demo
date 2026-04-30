import { randomUUID } from "node:crypto";
import type { OrderResponseDTO } from "@application/dto/order-response.dto";
import { OrderMapper } from "@application/mappers/order.mapper";
import { TYPES } from "@config/di/types";
import { Order } from "@domain/entities/order.entity";
import type { IOrderRepository } from "@domain/repositories/order.repository";
import { OrderStatus } from "@domain/value-objects/order-status.vo";
import { inject, injectable } from "inversify";

@injectable()
export class CreateOrder {
	constructor(@inject(TYPES.OrderRepository) private repo: IOrderRepository) {}

	async execute(
		userId: string,
		item: string,
		quantity: number,
		price: number,
	): Promise<OrderResponseDTO> {
		const order = new Order(
			randomUUID(),
			userId,
			item,
			quantity,
			price,
			OrderStatus.PENDING,
			new Date(),
		);

		const createdOrder = await this.repo.create(order);
		return OrderMapper.toDTO(createdOrder);
	}
}
