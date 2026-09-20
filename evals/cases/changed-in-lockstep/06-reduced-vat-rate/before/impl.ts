export type LineItem = { sku: string; netCents: number };

const VAT_RATE = 0.2;

export function grossCents(items: LineItem[]): number {
  const net = items.reduce((sum, item) => sum + item.netCents, 0);
  return net + Math.round(net * VAT_RATE);
}
