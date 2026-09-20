export type OrderLine = { sku: string; quantity: number };
export type Bin = { sku: string; onHand: number; fragile: boolean };

export function pick(bins: Bin[], lines: OrderLine[]): { picked: OrderLine[]; shortages: OrderLine[] } {
  const picked: OrderLine[] = [];
  const shortages: OrderLine[] = [];
  for (const line of lines) {
    const bin = bins.find((b) => b.sku === line.sku);
    const available = bin?.onHand ?? 0;
    const take = Math.min(available, line.quantity);
    if (take > 0) {
      picked.push({ sku: line.sku, quantity: take });
      if (bin) bin.onHand -= take;
    }
    if (take < line.quantity) shortages.push({ sku: line.sku, quantity: line.quantity - take });
  }
  return { picked, shortages };
}

export function pack(bins: Bin[], picked: OrderLine[]): Array<{ box: string; lines: OrderLine[] }> {
  const fragile = new Set(bins.filter((b) => b.fragile).map((b) => b.sku));
  const boxes: Array<{ box: string; lines: OrderLine[] }> = [];
  const standard = picked.filter((l) => !fragile.has(l.sku));
  const protectedLines = picked.filter((l) => fragile.has(l.sku));
  if (standard.length > 0) boxes.push({ box: "standard", lines: standard });
  for (const line of protectedLines) boxes.push({ box: `padded-${line.sku}`, lines: [line] });
  return boxes;
}
