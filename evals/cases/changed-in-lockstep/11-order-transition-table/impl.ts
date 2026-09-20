export type OrderStatus = "draft" | "placed" | "shipped" | "delivered" | "cancelled";

const ALLOWED: Record<OrderStatus, OrderStatus[]> = {
  draft: ["placed", "cancelled"],
  placed: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export function transition(from: OrderStatus, to: OrderStatus): OrderStatus {
  if (!ALLOWED[from].includes(to)) throw new Error(`cannot move from ${from} to ${to}`);
  return to;
}
