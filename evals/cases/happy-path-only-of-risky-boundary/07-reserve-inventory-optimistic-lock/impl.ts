export type StockRow = { sku: string; available: number; version: number };

export class StockTable {
  private rows = new Map<string, StockRow>();

  put(row: StockRow): void {
    this.rows.set(row.sku, row);
  }

  read(sku: string): StockRow {
    const row = this.rows.get(sku);
    if (!row) throw new Error(`unknown sku ${sku}`);
    return { ...row };
  }

  reserve(sku: string, quantity: number, expectedVersion: number): StockRow {
    const row = this.rows.get(sku);
    if (!row) throw new Error(`unknown sku ${sku}`);
    if (row.version !== expectedVersion) throw new Error("stale stock version");
    if (row.available < quantity) throw new Error("not enough stock");
    const next = { sku, available: row.available - quantity, version: row.version + 1 };
    this.rows.set(sku, next);
    return next;
  }
}
