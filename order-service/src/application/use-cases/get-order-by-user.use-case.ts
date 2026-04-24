import type { IOrderRepository } from "../../domain/repositories/order.repository";
import type { OrderResponseDTO } from "../dto/order-response.dto";
import { OrderMapper } from "../mappers/order.mapper";

export class GetOrderByUser {
  constructor(private repo: IOrderRepository) {}

  async execute(userId: string): Promise<OrderResponseDTO[] | null> {
    const orders = await this.repo.findOrderByUserId(userId);

    return OrderMapper.toDTOList(orders);
  }
}
