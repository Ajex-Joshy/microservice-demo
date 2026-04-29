import { OrderResponseDTO } from "@application/dto/order-response.dto";
import { OrderMapper } from "@application/mappers/order.mapper";
import type { IOrderRepository } from "@domain/repositories/order.repository";
import { inject, injectable } from "inversify";
import { TYPES } from "@config/di/types";

@injectable()
export class GetOrderByUser {
  constructor(@inject(TYPES.OrderRepository) private repo: IOrderRepository) {}

  async execute(userId: string): Promise<OrderResponseDTO[] | null> {
    const orders = await this.repo.findByUserId(userId);

    return OrderMapper.toDTOList(orders);
  }
}
