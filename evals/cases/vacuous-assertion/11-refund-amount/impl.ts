export type OrderLine = { sku: string; qty: number; unitCents: number; returned: number };

export type Order = { id: string; lines: OrderLine[]; shippingCents: number; usedPromo: boolean };

export function refundCents(order: Order): number {
  const lineRefund = order.lines.reduce(
    (sum, line) => sum + line.returned * line.unitCents,
    0,
  );
  const everythingBack = order.lines.every((line) => line.returned === line.qty);
  const shipping = everythingBack ? order.shippingCents : 0;
  const promoAdjustment = order.usedPromo ? Math.round(lineRefund * 0.1) : 0;
  return lineRefund + shipping - promoAdjustment;
}
