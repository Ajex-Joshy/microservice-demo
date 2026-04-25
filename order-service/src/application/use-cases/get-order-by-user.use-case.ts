import type { IOrderRepository } from "@domain/repositories/order.repository";
import { OrderMapper } from "../mappers/order.mapper";
import { OrderResponseDTO } from "@application/dto/order-response.dto";

export class GetOrderByUser {
	constructor(private repo: IOrderRepository) { }

	async execute(userId: string): Promise<OrderResponseDTO[] | null> {
		const orders = await this.repo.findByUserId(userId);

		return OrderMapper.toDTOList(orders);
	}
}
