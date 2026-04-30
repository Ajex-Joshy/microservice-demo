import { OrderStatus } from "@domain/value-objects/order-status.vo";
import { z } from "zod";

export const createOrderSchema = z.object({
	item: z
		.string({ message: "Item name is required" })
		.trim()
		.min(1, "Item name cannot be empty"),
	quantity: z
		.number({ message: "Quantity is required" })
		.int("Quantity must be an integer")
		.positive("Quantity must be greater than zero"),
	price: z
		.number({ message: "Price is required" })
		.positive("Price must be greater than zero"),
});

export const updateOrderStatusSchema = z.object({
	status: z.nativeEnum(OrderStatus, {
		message: "Invalid order status",
	}),
});
