export type Item = { id: string; body: string };

export function byteLength(item: Item): number {
  return Buffer.byteLength(JSON.stringify(item), "utf8");
}

export function splitByBudget(items: Item[], budgetBytes: number): Item[][] {
  const batches: Item[][] = [];
  let current: Item[] = [];
  let used = 0;
  for (const item of items) {
    const size = byteLength(item);
    if (size > budgetBytes) throw new RangeError(`item ${item.id} does not fit a single batch`);
    if (used + size > budgetBytes) {
      batches.push(current);
      current = [];
      used = 0;
    }
    current.push(item);
    used += size;
  }
  if (current.length > 0) batches.push(current);
  return batches;
}

export function reassemble(batches: Item[][]): Item[] {
  return batches.flat();
}
