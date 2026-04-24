import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { OrderDTO } from "../../application/dto/order.dto";
import path from "node:path";
const packageDef = protoLoader.loadSync(
  path.resolve(process.cwd(), "../proto/order.proto"),
);
const proto = grpc.loadPackageDefinition(packageDef) as any;

export class OrderClient {
  private client;

  constructor() {
    this.client = new proto.OrderService(
      process.env.ORDER_SERVICE_URL ?? "127.0.0.1:50052",
      grpc.credentials.createInsecure(),
    );
  }

  getOrders(userId: string): Promise<OrderDTO[]> {
    return new Promise((resolve, reject) => {
      this.client.GetOrdersByUser({ userId }, (err: any, res: any) => {
        if (err) {
          return reject(err);
        }

        if (!res || !Array.isArray(res.orders)) {
          return resolve([]);
        }

        const orders: OrderDTO[] = res.orders.map((o: any) => {
          if (!o?.id || !o?.product || o?.quantity == null) {
            throw new Error("Invalid order data from OrderService");
          }
          return {
            id: o.id,
            product: o.product,
            quantity: o.quantity,
          };
        });

        resolve(orders);
      });
    });
  }
}
