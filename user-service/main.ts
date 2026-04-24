import { GetUser } from "./src/application/use-cases/get-user.use-case";
import { connectDB } from "./src/infrastructure/db/mongo";
import { MonogoUserRepository } from "./src/infrastructure/db/mongo-user.repository";
import { OrderClient } from "./src/infrastructure/grpc/order.client";
import { UserController } from "./src/interfaces/grpc/user.controller";

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "node:path";
import "dotenv/config";

class InMemoryUserRepository {
  private readonly users = [
    { id: "u1", name: "Ajex Joshy", email: "ajex@example.com" },
    { id: "u2", name: "Demo User", email: "demo@example.com" },
  ];

  async findById(id: string) {
    const user = this.users.find((entry) => entry.id === id);
    return user ?? null;
  }
}

const userProtoPath = path.resolve(process.cwd(), "../proto/user.proto");

async function buildUserRepository() {
  if (process.env.USE_IN_MEMORY_DEMO === "true" || !process.env.MONGO_URI) {
    console.log("Using in-memory user repository");
    return new InMemoryUserRepository();
  }

  try {
    await connectDB();
    return new MonogoUserRepository();
  } catch (error) {
    console.warn("Falling back to in-memory user repository");
    return new InMemoryUserRepository();
  }
}

async function start() {
  const repo = await buildUserRepository();
  const orderClient = new OrderClient();
  const useCase = new GetUser(repo, orderClient);
  const controller = new UserController(useCase);

  const def = protoLoader.loadSync(userProtoPath);
  const proto = grpc.loadPackageDefinition(def) as any;

  const server = new grpc.Server();

  server.addService(proto.UserService.service, {
    GetUser: controller.GetUser,
  });

  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log("User service running on 50051");
      server.start();
    },
  );
}

start();
