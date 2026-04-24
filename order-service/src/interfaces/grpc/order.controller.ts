import * as grpc from "@grpc/grpc-js";
import { GetOrderByUser } from "../../application/use-cases/get-order-by-user.use-case";

export class OrderController {
  constructor(private useCase: GetOrderByUser) {}

  GetOrdersByUser = async (call: any, cb: any) => {
    try {
      const orders = await this.useCase.execute(call.request.userId);
      cb(null, { orders });
    } catch (error: any) {
      cb({
        code: grpc.status.INTERNAL,
        message: error.message,
      });
    }
  };
}
