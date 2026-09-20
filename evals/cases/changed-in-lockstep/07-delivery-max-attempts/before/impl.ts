export type Delivery = { id: string; attempts: number; status: "pending" | "failed" | "dead" };

const MAX_ATTEMPTS = 3;

export function recordFailure(delivery: Delivery): Delivery {
  const attempts = delivery.attempts + 1;
  return { ...delivery, attempts, status: attempts >= MAX_ATTEMPTS ? "dead" : "failed" };
}
