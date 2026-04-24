import { prisma } from "./src/infrastructure/db/prisma/prisma.client";

async function seed() {
  await prisma.order.deleteMany({});

  await prisma.order.createMany({
    data: [
      { id: "o101", userId: "650b8b8a0f9b8c001c8e4b1a", product: "MacBook Pro", quantity: 1 },
      { id: "o102", userId: "650b8b8a0f9b8c001c8e4b1a", product: "Magic Mouse", quantity: 2 },
      { id: "o201", userId: "650b8b8a0f9b8c001c8e4b1b", product: "Mechanical Keyboard", quantity: 1 },
    ],
  });

  console.log("Orders seeded.");
  await prisma.$disconnect();
}

seed().catch(console.error);
