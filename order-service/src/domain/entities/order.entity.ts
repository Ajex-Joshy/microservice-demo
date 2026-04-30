import { OrderStateTransitionException } from "../exceptions/OrderStateTransitionException";
import { OrderValidationException } from "../exceptions/OrderValidationException";
import { OrderStatus } from "../value-objects/order-status.vo";

export class Order {
	constructor(
		public readonly id: string,
		public readonly userId: string,
		public item: string,
		public quantity: number,
		public price: number,
		public status: OrderStatus,
		public readonly createdAt: Date,
	) {
		this.validate();
	}

	private validate() {
		if (!this.userId) {
			throw new OrderValidationException("UserId is required");
		}

		if (!this.item || this.item.trim().length === 0) {
			throw new OrderValidationException("Item is required");
		}

		if (this.quantity <= 0) {
			throw new OrderValidationException("Quantity must be greater than 0");
		}

		if (this.price <= 0) {
			throw new OrderValidationException("Price must be greater than 0");
		}
	}

	private static readonly validTransitions: Record<OrderStatus, OrderStatus[]> =
		{
			[OrderStatus.PENDING]: [OrderStatus.PROCESSING],
			[OrderStatus.PROCESSING]: [OrderStatus.SHIPPED],
			[OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
			[OrderStatus.DELIVERED]: [],
		};

	updateStatus(newStatus: OrderStatus) {
		if (this.status === newStatus) return;

		const allowed = Order.validTransitions[this.status];

		if (!allowed?.includes(newStatus)) {
			throw new OrderStateTransitionException(
				`Invalid status transition from ${this.status} to ${newStatus}`,
				{
					currentStatus: this.status,
					attemptedStatus: newStatus,
					allowedTransitions: allowed,
				},
			);
		}

		this.status = newStatus;
	}
}
