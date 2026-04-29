import type { IOrderRepository } from "@domain/repositories/order.repository";
import type { OrderStatus } from "@domain/value-objects/order-status.vo";
import { UnauthorizedException } from "../exceptions/unauthorized.exception";
import type { IUserServiceClient } from "../interfaces/user.client.interface";
import { OrderResponseDTO } from "@application/dto/order-response.dto";
import { OrderMapper } from "@application/mappers/order.mapper";
import { inject, injectable } from "inversify";
import { TYPES } from "@config/di/types";
import { OrderNotFoundException } from "@application/exceptions/order-not-found.exceptions";

@injectable()
export class UpdateOrderStatus {
  constructor(
    @inject(TYPES.OrderRepository) private orderRepo: IOrderRepository,
    @inject(TYPES.UserServiceClient) private userClient: IUserServiceClient,
  ) {}

  async execute(
    orderId: string,
    newStatus: OrderStatus,
    adminId: string,
  ): Promise<OrderResponseDTO> {
    // 1. Verify remote Admin role securely via generic interface
    const role = await this.userClient.getUserRole(adminId);
    if (role !== "ADMIN") {
      throw new UnauthorizedException(
        "Only administrators can update order status",
      );
    }

    // 2. Fetch current physical entity
    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw new OrderNotFoundException(orderId);
    }

    // 3. Delegate to domain pure business validations (checking if order was already DELIVERED)
    order.updateStatus(newStatus);

    // 4. Invokes physical layer updates
    const updatedOrder = await this.orderRepo.updateStatus(orderId, newStatus);
    return OrderMapper.toDTO(updatedOrder);
  }
}
