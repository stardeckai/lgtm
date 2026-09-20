export class StockLedger {
  private stock = new Map<string, number>();

  constructor(initial: Record<string, number>) {
    for (const [sku, qty] of Object.entries(initial)) this.stock.set(sku, qty);
  }

  onHand(sku: string): number {
    return this.stock.get(sku) ?? 0;
  }

  async reserve(sku: string, quantity: number): Promise<boolean> {
    const available = this.stock.get(sku) ?? 0;
    if (available < quantity) return false;
    this.stock.set(sku, available - quantity);
    await Promise.resolve();
    return true;
  }
}
