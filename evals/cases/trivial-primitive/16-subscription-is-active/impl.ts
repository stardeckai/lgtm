export type SubscriptionRecord = {
  id: string;
  status: "trialing" | "active" | "past_due" | "canceled";
  currentPeriodEndMs: number;
};

export function isActive(subscription: SubscriptionRecord): boolean {
  return subscription.status === "active";
}

export function renewalBanner(subscription: SubscriptionRecord, nowMs: number): string | null {
  if (!isActive(subscription)) return null;
  const days = Math.ceil((subscription.currentPeriodEndMs - nowMs) / 86_400_000);
  return days <= 7 ? `Renews in ${days} days` : null;
}
