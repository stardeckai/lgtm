export type Layer = { receivedAt: string; qty: number; unitCents: number };

export type Consumption = { cogsCents: number; remaining: Layer[] };

export function consumeFifo(layers: Layer[], qty: number): Consumption {
  const ordered = [...layers].sort((a, b) => a.receivedAt.localeCompare(b.receivedAt));
  let left = qty;
  let cogs = 0;
  const remaining: Layer[] = [];
  for (const layer of ordered) {
    const take = Math.min(left, layer.qty);
    cogs += take * layer.unitCents;
    left -= take;
    if (layer.qty - take > 0) remaining.push({ ...layer, qty: layer.qty - take });
  }
  if (left > 0) throw new Error(`insufficient stock, short by ${left}`);
  return { cogsCents: cogs, remaining };
}
