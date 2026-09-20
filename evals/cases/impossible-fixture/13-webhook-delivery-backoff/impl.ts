export type Delivery = {
  id: string;
  endpoint: string;
  attempts: number;
  lastStatus: number | null;
};

export function enqueueDelivery(id: string, endpoint: string): Delivery {
  return { id, endpoint, attempts: 0, lastStatus: null };
}

export function recordAttempt(delivery: Delivery, status: number): Delivery {
  return { ...delivery, attempts: delivery.attempts + 1, lastStatus: status };
}

export function nextRetryDelayMs(delivery: Delivery): number {
  if (delivery.attempts >= 6) return -1;
  return Math.min(3_600_000, 1000 * 2 ** delivery.attempts);
}
