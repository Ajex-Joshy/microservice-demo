import { z } from "zod";
import { OrderStatus } from "@domain/value-objects/order-status.vo";

export const createOrderSchema = z.object({
  item: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});
