import { Order } from "@domain/entities/order.entity";
import type { IOrderRepository } from "@domain/repositories/order.repository";
import { DatabaseException } from "../../exceptions/Database.exception";
import { prisma } from "./prisma.client";

export class PrismaOrderRepository implements IOrderRepository {
	async findByUserId(userId: string): Promise<Order[]> {
		try {
			const data = await prisma.order.findMany({
				where: { userId },
			});
			return data.map(
				(o: any) =>
					new Order(
						o.id,
						o.userId,
						o.item,
						o.quantity,
						o.price || 0,
						(o.status as any) || "PENDING",
						o.createdAt || new Date(),
					),
			);
		} catch (error) {
			throw new DatabaseException(
				`Database error in fetching orders: ${(error as Error).message}`,
			);
		}
	}

	async create(order: Order): Promise<Order> {
		try {
			const created = await prisma.order.create({
				data: {
					id: order.id,
					userId: order.userId,
					item: order.item,
					quantity: order.quantity,
					price: order.price,
					status: order.status as any,
				},
			});
			return new Order(
				created.id,
				created.userId,
				created.item,
				created.quantity,
				created.price || 0,
				(created.status as any) || "PENDING",
				created.createdAt || new Date(),
			);
		} catch (error) {
			throw new DatabaseException(
				`Failed to create order: ${(error as Error).message}`,
			);
		}
	}

	async findById(id: string): Promise<Order | null> {
		try {
			const data = await prisma.order.findUnique({
				where: { id },
			});
			if (!data) return null;
			return new Order(
				data.id,
				data.userId,
				data.item,
				data.quantity,
				data.price || 0,
				(data.status as any) || "PENDING",
				data.createdAt || new Date(),
			);
		} catch (error) {
			throw new DatabaseException(
				`Failed to find order by id: ${(error as Error).message}`,
			);
		}
	}

	async updateStatus(id: string, status: any): Promise<Order> {
		try {
			const updated = await prisma.order.update({
				where: { id },
				data: { status },
			});
			return new Order(
				updated.id,
				updated.userId,
				updated.item,
				updated.quantity,
				updated.price || 0,
				(updated.status as any) || "PENDING",
				updated.createdAt || new Date(),
			);
		} catch (error) {
			throw new DatabaseException(
				`Failed to update order status: ${(error as Error).message}`,
			);
		}
	}
}
