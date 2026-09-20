export type Order = { id: string; totalCents: number; status: "pending" | "paid" };

export interface OrderRepository {
  find(id: string): Promise<Order | null>;
  save(order: Order): Promise<void>;
}

export async function markPaid(repo: OrderRepository, id: string): Promise<Order> {
  const order = await repo.find(id);
  if (!order) throw new Error(`unknown order ${id}`);
  if (order.status === "paid") return order;
  const paid: Order = { ...order, status: "paid" };
  await repo.save(paid);
  return paid;
}
