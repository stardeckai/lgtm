export type Line = { sku: string; qty: number };

export interface Warehouse {
  reserve(sku: string, qty: number): Promise<void>;
}

export type StockLevels = Record<string, number>;

export async function reserveOrder(
  warehouse: Warehouse,
  levels: StockLevels,
  lines: Line[],
): Promise<{ reserved: Line[]; backordered: Line[] }> {
  const reserved: Line[] = [];
  const backordered: Line[] = [];
  for (const line of lines) {
    const available = levels[line.sku] ?? 0;
    if (available >= line.qty) {
      await warehouse.reserve(line.sku, line.qty);
      reserved.push(line);
    } else if (available > 0) {
      await warehouse.reserve(line.sku, available);
      reserved.push({ sku: line.sku, qty: available });
      backordered.push({ sku: line.sku, qty: line.qty - available });
    } else {
      backordered.push(line);
    }
  }
  return { reserved, backordered };
}
