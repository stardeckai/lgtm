export type StockLevel = { sku: string; onHand: number; reserved: number };

export type Reservation = { sku: string; reservedQty: number; remaining: number };

export function reserve(level: StockLevel, requestedQty: number): Reservation {
  const available = level.onHand - level.reserved;
  const reservedQty = requestedQty > available ? available : requestedQty;
  return {
    sku: level.sku,
    reservedQty,
    remaining: available - reservedQty,
  };
}
