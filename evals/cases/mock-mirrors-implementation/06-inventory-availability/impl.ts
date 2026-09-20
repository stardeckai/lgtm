export type StockRow = { sku: string; onHand: number; reserved: number; incoming: number };

export interface StockReader {
  available(sku: string): number;
}

export class WarehouseStock implements StockReader {
  constructor(private readonly rows: StockRow[]) {}
  available(sku: string): number {
    const row = this.rows.find((r) => r.sku === sku);
    if (!row) return 0;
    return Math.max(0, row.onHand - row.reserved) + row.incoming;
  }
}

export type LineRequest = { sku: string; qty: number };

export function fulfilment(reader: StockReader, lines: LineRequest[]): "full" | "partial" | "none" {
  const satisfied = lines.filter((line) => reader.available(line.sku) >= line.qty).length;
  if (satisfied === lines.length) return "full";
  return satisfied === 0 ? "none" : "partial";
}
