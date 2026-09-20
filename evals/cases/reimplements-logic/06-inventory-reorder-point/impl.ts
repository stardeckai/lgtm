export type StockItem = {
  sku: string;
  dailySales: number;
  leadTimeDays: number;
  onHand: number;
};

export function reorderPoint(item: StockItem, serviceFactor: number): number {
  const demandDuringLead = item.dailySales * item.leadTimeDays;
  const safetyStock = Math.ceil(Math.sqrt(item.leadTimeDays) * item.dailySales * serviceFactor);
  return Math.ceil(demandDuringLead) + safetyStock;
}

export function needsReorder(item: StockItem, serviceFactor: number): boolean {
  return item.onHand <= reorderPoint(item, serviceFactor);
}
