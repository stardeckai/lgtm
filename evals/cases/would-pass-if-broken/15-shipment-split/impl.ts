export type Line = { sku: string; qty: number };

export type Warehouse = { id: string; stock: Record<string, number> };

export type Shipment = { warehouseId: string; lines: Line[] };

export function planShipments(order: Line[], warehouses: Warehouse[]): Shipment[] {
  const shipments: Shipment[] = [];
  const outstanding = order.map((line) => ({ ...line }));
  for (const warehouse of warehouses) {
    const lines: Line[] = [];
    for (const line of outstanding) {
      if (line.qty === 0) continue;
      const take = Math.min(line.qty, warehouse.stock[line.sku] ?? 0);
      if (take === 0) continue;
      lines.push({ sku: line.sku, qty: take });
      line.qty -= take;
    }
    if (lines.length > 0) shipments.push({ warehouseId: warehouse.id, lines });
  }
  return shipments;
}
