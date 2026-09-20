export type StockRow = { sku: string; warehouseId: string; onHand: number; reserved: number };

export function availableUnits(rows: StockRow[], sku: string, warehouseId: string): number {
  const row = rows.find((r) => r.sku === sku && r.warehouseId === warehouseId);
  if (!row) return 0;
  return Math.max(0, row.onHand - row.reserved);
}

export function totalOnHand(rows: StockRow[], sku: string): number {
  return rows.filter((r) => r.sku === sku).reduce((sum, r) => sum + r.onHand, 0);
}

export function reserve(rows: StockRow[], sku: string, warehouseId: string, qty: number): StockRow {
  const row = rows.find((r) => r.sku === sku && r.warehouseId === warehouseId);
  if (!row) throw new Error(`no stock row for ${sku} in ${warehouseId}`);
  if (availableUnits(rows, sku, warehouseId) < qty) throw new Error("insufficient stock");
  row.reserved += qty;
  return row;
}
