export type OrderLine = { sku: string; qty: number; unitCents: number };
export type Order = { id: string; lines: OrderLine[] };

export function totalItems(order: Order): number {
  return order.lines.reduce((sum, line) => sum + line.qty, 0);
}

export function packingSlip(order: Order): string {
  return `${order.id}: ${totalItems(order)} items across ${order.lines.length} lines`;
}
