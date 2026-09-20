const DAY_MS = 24 * 60 * 60 * 1000;

function returnWindowMs(): number {
  return 30 * DAY_MS;
}

export type Shipment = { orderId: string; deliveredAtMs: number };

export function canReturn(shipment: Shipment, nowMs: number): boolean {
  return nowMs - shipment.deliveredAtMs <= returnWindowMs();
}
