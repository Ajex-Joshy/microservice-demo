// Infra Auth
import type { IUserServiceClient } from "@application/interfaces/user.client.interface";
// Use Cases
import { CreateOrder } from "@application/use-cases/create-order.use-case";
import { GetOrderById } from "@application/use-cases/get-order-by-id.use-case";
import { GetOrderByUser } from "@application/use-cases/get-order-by-user.use-case";
import { UpdateOrderStatus } from "@application/use-cases/update-order-status.use-case";
// Repositories
import type { IOrderRepository } from "@domain/repositories/order.repository";
import { JwtService } from "@infrastructure/auth/jwt.service";
import { PrismaOrderRepository } from "@infrastructure/db/prisma/prisma-order.repository";
import { UserGrpcClient } from "@infrastructure/grpc/user.client";
// Http
import { OrderController } from "@interfaces/http/controllers/order.controller";
import { AuthMiddleware } from "@interfaces/http/middlewares/auth.middleware";
import { OrderRoutes } from "@interfaces/http/routes/order.routes";
import { Container } from "inversify";
import { TYPES } from "./types";

const container = new Container();

container
	.bind<IOrderRepository>(TYPES.OrderRepository)
	.to(PrismaOrderRepository)
	.inSingletonScope();
container
	.bind<IUserServiceClient>(TYPES.UserServiceClient)
	.to(UserGrpcClient)
	.inSingletonScope();
container.bind<JwtService>(TYPES.JwtService).to(JwtService).inSingletonScope();
container
	.bind<AuthMiddleware>(TYPES.AuthMiddleware)
	.to(AuthMiddleware)
	.inSingletonScope();

// App UseCases
container.bind<CreateOrder>(TYPES.CreateOrder).to(CreateOrder);
container
	.bind<UpdateOrderStatus>(TYPES.UpdateOrderStatus)
	.to(UpdateOrderStatus);
container.bind<GetOrderById>(TYPES.GetOrderById).to(GetOrderById);
container.bind<GetOrderByUser>(TYPES.GetOrderByUser).to(GetOrderByUser);

// Presentation
container.bind<OrderController>(TYPES.OrderController).to(OrderController);
container.bind<OrderRoutes>(TYPES.OrderRoutes).to(OrderRoutes);

export { container };
