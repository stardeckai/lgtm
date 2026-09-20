export type Plan = { code: "team" | "business"; minSeats: number; seatCents: number };

export const PLANS: Record<Plan["code"], Plan> = {
  team: { code: "team", minSeats: 1, seatCents: 1200 },
  business: { code: "business", minSeats: 5, seatCents: 2000 },
};

export type Subscription = { id: string; plan: Plan["code"]; seats: number };

export function openSubscription(id: string, plan: Plan["code"], seats: number): Subscription {
  const definition = PLANS[plan];
  if (!Number.isInteger(seats) || seats < definition.minSeats) {
    throw new Error(`${plan} needs at least ${definition.minSeats} seats`);
  }
  return { id, plan, seats };
}

export function prorationCents(subscription: Subscription, daysRemaining: number): number {
  const monthly = PLANS[subscription.plan].seatCents * subscription.seats;
  return Math.round((monthly * daysRemaining) / 30);
}
