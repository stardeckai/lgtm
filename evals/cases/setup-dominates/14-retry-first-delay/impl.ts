export type Delivery = { id: string; attempt: number; status: "pending" | "failed" | "delivered" };

const BASE_DELAY_MS = 2000;
const MAX_DELAY_MS = 3_600_000;

export function nextDelayMs(attempt: number, jitterFraction: number): number {
  const exponential = BASE_DELAY_MS * 2 ** Math.max(0, attempt - 1);
  const capped = Math.min(exponential, MAX_DELAY_MS);
  return Math.round(capped * (1 + jitterFraction));
}
