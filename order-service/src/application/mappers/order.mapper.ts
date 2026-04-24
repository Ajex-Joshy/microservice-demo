import { Order } from "../../domain/entities/order.entity";
import type { OrderResponseDTO } from "../dto/order-response.dto";

export class OrderMapper {
  static toDTO(order: Order): OrderResponseDTO {
    return {
      id: order.id,
      product: order.product,
      quantity: order.quantity,
    };
  }

  static toDTOList(orders: Order[] | null): OrderResponseDTO[] {
    if (!orders) return [];
    return orders.map(this.toDTO);
  }
}
