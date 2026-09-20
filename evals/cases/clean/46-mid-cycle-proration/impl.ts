export type Plan = { name: string; monthlyCents: number };

export function prorate(from: Plan, to: Plan, dayOfCycle: number, daysInCycle: number): { chargeCents: number; creditCents: number } {
  if (dayOfCycle < 1 || dayOfCycle > daysInCycle) throw new RangeError("day is outside the cycle");
  const remainingDays = daysInCycle - dayOfCycle + 1;
  const creditCents = Math.floor((from.monthlyCents * remainingDays) / daysInCycle);
  const chargeCents = Math.ceil((to.monthlyCents * remainingDays) / daysInCycle);
  return { chargeCents, creditCents };
}

export function netDueCents(from: Plan, to: Plan, dayOfCycle: number, daysInCycle: number): number {
  const { chargeCents, creditCents } = prorate(from, to, dayOfCycle, daysInCycle);
  return Math.max(0, chargeCents - creditCents);
}
