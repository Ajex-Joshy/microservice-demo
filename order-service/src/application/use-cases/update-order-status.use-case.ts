import { inject, injectable } from "inversify";
import { TYPES } from "@config/di/types";
import type { IOrderRepository } from "@domain/repositories/order.repository";
import type { OrderStatus } from "@domain/value-objects/order-status.vo";
import { status } from "@grpc/grpc-js";
import { HTTP_STATUS } from "@shared/constants/http-status.constants";
import { BaseException } from "@shared/exceptions/BaseException";
import { OrderResponseDTO } from "@application/dto/order-response.dto";
import { UnauthorizedException } from "../exceptions/unauthorized.exception";
import type { IUserServiceClient } from "../interfaces/user.client.interface";
import { OrderMapper } from "../mappers/order.mapper";

class OrderNotFoundException extends BaseException {
	constructor(id: string) {
		super(
			`Order with id ${id} not found`,
			"ORDER_NOT_FOUND",
			HTTP_STATUS.NOT_FOUND,
			status.NOT_FOUND,
			false,
		);
		Object.setPrototypeOf(this, OrderNotFoundException.prototype);
	}
}

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
