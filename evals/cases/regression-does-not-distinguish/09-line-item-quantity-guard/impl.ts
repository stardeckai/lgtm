export type Line = { sku: string; quantity: number; unitCents: number };

export function orderTotalCents(lines: Line[]): number {
  let total = 0;
  for (const line of lines) {
    if (!Number.isInteger(line.quantity) || line.quantity < 1) {
      throw new RangeError(`invalid quantity for ${line.sku}`);
    }
    total += line.quantity * line.unitCents;
  }
  return total;
}
