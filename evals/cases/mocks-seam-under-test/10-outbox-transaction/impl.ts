export type OutboxRow = { id: string; topic: string; body: string; publishedAt: string | null };

export interface UnitOfWork {
  insertOrder(order: { id: string; totalCents: number }): Promise<void>;
  insertOutbox(row: OutboxRow): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export async function placeOrder(
  uow: UnitOfWork,
  order: { id: string; totalCents: number },
): Promise<OutboxRow> {
  const row: OutboxRow = {
    id: `ob_${order.id}`,
    topic: "order.placed",
    body: JSON.stringify(order),
    publishedAt: null,
  };
  try {
    await uow.insertOrder(order);
    await uow.insertOutbox(row);
    await uow.commit();
  } catch (error) {
    await uow.rollback();
    throw error;
  }
  return row;
}
