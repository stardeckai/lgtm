export type OrderLine = { sku: string; qty: number };

export type Order = { id: string; status: "placed" | "cancelled"; lines: OrderLine[] };

export class Store {
  constructor(
    readonly orders: Map<string, Order>,
    readonly stock: Map<string, number>,
  ) {}

  cancel(orderId: string): void {
    const order = this.orders.get(orderId);
    if (!order) throw new Error(`no such order: ${orderId}`);
    if (order.status === "cancelled") return;
    order.status = "cancelled";
    for (const line of order.lines) {
      this.stock.set(line.sku, (this.stock.get(line.sku) ?? 0) + line.qty);
    }
  }
}
