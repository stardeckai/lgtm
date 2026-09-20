export type Delivery = { id: string; attempt: number; lastStatus: number };

export interface RetryScheduler {
  schedule(deliveryId: string, delayMs: number): void;
}

export interface DeadLetters {
  park(deliveryId: string, reason: string): void;
}

const BACKOFF_MS = [1_000, 5_000, 30_000, 300_000];

export function handleDeliveryResult(
  scheduler: RetryScheduler,
  deadLetters: DeadLetters,
  delivery: Delivery,
): "done" | "retry" | "parked" {
  if (delivery.lastStatus >= 200 && delivery.lastStatus < 300) return "done";
  if (delivery.lastStatus >= 400 && delivery.lastStatus < 500 && delivery.lastStatus !== 429) {
    deadLetters.park(delivery.id, `client error ${delivery.lastStatus}`);
    return "parked";
  }
  const delay = BACKOFF_MS[delivery.attempt];
  if (delay === undefined) {
    deadLetters.park(delivery.id, "attempts exhausted");
    return "parked";
  }
  scheduler.schedule(delivery.id, delay);
  return "retry";
}
