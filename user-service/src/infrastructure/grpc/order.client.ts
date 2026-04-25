import path from "node:path";
import type { OrderDTO } from "@application/dto/order.dto";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const packageDef = protoLoader.loadSync(
  path.resolve(process.cwd(), "../proto/order.proto"),
);
const proto = grpc.loadPackageDefinition(packageDef) as grpc.GrpcObject;

export class OrderClient {
  private client: unknown;

  constructor() {
    const Service = proto.OrderService as typeof grpc.Client;
    this.client = new Service(
      process.env.ORDER_SERVICE_URL ?? "127.0.0.1:50052",
      grpc.credentials.createInsecure(),
    );
  }

  getOrders(userId: string): Promise<OrderDTO[]> {
    return new Promise((resolve, reject) => {
      const client = this.client as grpc.Client & {
        GetOrdersByUser: (
          arg0: { userId: string },
          arg1: (
            err: grpc.ServiceError | null,
            res: { orders: unknown[] },
          ) => void,
        ) => void;
      };
      client.GetOrdersByUser(
        { userId },
        (err: grpc.ServiceError | null, res: { orders: unknown[] }) => {
          if (err) {
            return reject(err);
          }

          if (!res || !Array.isArray(res.orders)) {
            return resolve([]);
          }

          const orders: OrderDTO[] = res.orders.map((o: unknown) => {
            const orderObj = o as Record<string, unknown>;
            if (
              !orderObj?.id ||
              !orderObj?.product ||
              orderObj?.quantity == null
            ) {
              throw new Error("Invalid order data from OrderService");
            }
            return {
              id: String(orderObj.id),
              product: String(orderObj.product),
              quantity: Number(orderObj.quantity),
            };
          });

          resolve(orders);
        },
      );
    });
  }
}
