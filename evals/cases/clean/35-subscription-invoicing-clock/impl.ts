export type Subscription = { id: string; status: "trialing" | "active" | "past_due" | "cancelled"; trialEndsMs: number; priceCents: number; periodMs: number; nextInvoiceMs: number };

export function advance(subscription: Subscription, nowMs: number): Subscription {
  if (subscription.status === "cancelled") return subscription;
  if (subscription.status === "trialing" && nowMs >= subscription.trialEndsMs) {
    return { ...subscription, status: "active", nextInvoiceMs: subscription.trialEndsMs };
  }
  return subscription;
}

export type Invoice = { subscriptionId: string; amountCents: number; issuedAtMs: number };

export function issueDue(subscription: Subscription, nowMs: number): { subscription: Subscription; invoices: Invoice[] } {
  let current = advance(subscription, nowMs);
  const invoices: Invoice[] = [];
  while (current.status === "active" && nowMs >= current.nextInvoiceMs) {
    invoices.push({ subscriptionId: current.id, amountCents: current.priceCents, issuedAtMs: current.nextInvoiceMs });
    current = { ...current, nextInvoiceMs: current.nextInvoiceMs + current.periodMs };
  }
  return { subscription: current, invoices };
}
