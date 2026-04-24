export class Order {
  constructor(
    public id: string,
    public userId: string,
    public product: string,
    public quantity: number,
  ) {}
}
