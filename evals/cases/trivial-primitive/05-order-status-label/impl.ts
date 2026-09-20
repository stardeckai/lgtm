export type OrderStatus = "draft" | "placed" | "packed" | "shipped";

const LABELS: Record<OrderStatus, string> = {
  draft: "Draft",
  placed: "Placed",
  packed: "Packed",
  shipped: "Shipped",
};

export function statusLabel(status: OrderStatus): string {
  return LABELS[status];
}

export function orderRow(order: { id: string; status: OrderStatus }): string {
  return `${order.id} — ${statusLabel(order.status)}`;
}
