export type StockLevel = { sku: string; onHand: number; reserved: number };

export class InventoryStore {
  readonly levels = new Map<string, StockLevel>();

  receive(sku: string, quantity: number): void {
    const level = this.levels.get(sku) ?? { sku, onHand: 0, reserved: 0 };
    this.levels.set(sku, { ...level, onHand: level.onHand + quantity });
  }

  reserve(sku: string, quantity: number): void {
    const level = this.levels.get(sku);
    if (!level) throw new Error(`unknown sku ${sku}`);
    if (level.reserved + quantity > level.onHand) throw new Error(`cannot reserve ${quantity} of ${sku}`);
    this.levels.set(sku, { ...level, reserved: level.reserved + quantity });
  }
}

export function availableUnits(store: InventoryStore, sku: string): number {
  const level = store.levels.get(sku);
  if (!level) return 0;
  return Math.max(0, level.onHand - level.reserved);
}
