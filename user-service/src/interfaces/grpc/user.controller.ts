export class UserController {
  constructor(
    private useCase: {
      execute(
        userId: string,
      ): Promise<{
        user: { id: string; name: string; email: string };
        orders: Array<{ id: string; product: string; quantity: number }>;
      }>;
    },
  ) {}

  GetUser = async (call: any, cb: any) => {
    try {
      const result = await this.useCase.execute(call.request.id);
      cb(null, {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        orders: result.orders,
      });
    } catch (error: any) {
      cb({
        code: 13,
        message: error.message,
      });
    }
  };
}
