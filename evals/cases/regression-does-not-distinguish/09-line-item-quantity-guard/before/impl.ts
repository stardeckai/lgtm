export type Line = { sku: string; quantity: number; unitCents: number };

export function orderTotalCents(lines: Line[]): number {
  let total = 0;
  for (const line of lines) {
    total += line.quantity * line.unitCents;
  }
  return total;
}
