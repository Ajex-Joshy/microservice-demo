import { prisma } from "./src/infrastructure/db/prisma/prisma.client";

async function seed() {
	await prisma.order.deleteMany({});

	await prisma.order.createMany({
		data: [
			{
				id: "o101",
				userId: "650b8b8a0f9b8c001c8e4b1a",
				item: "MacBook Pro",
				quantity: 1,
				price: 1999.99,
			},
			{
				id: "o102",
				userId: "650b8b8a0f9b8c001c8e4b1a",
				item: "Magic Mouse",
				quantity: 2,
				price: 79.0,
			},
			{
				id: "o201",
				userId: "650b8b8a0f9b8c001c8e4b1b",
				item: "Mechanical Keyboard",
				quantity: 1,
				price: 150.0,
			},
		],
	});

	console.log("Orders seeded.");
	await prisma.$disconnect();
}

seed().catch(console.error);
