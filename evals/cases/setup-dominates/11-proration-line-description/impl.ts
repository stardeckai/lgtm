export type Plan = { id: string; name: string; monthlyCents: number };
export type ProrationLine = { description: string; amountCents: number };

export function prorationLine(from: Plan, to: Plan, daysRemaining: number, daysInPeriod: number): ProrationLine {
  const unused = Math.round((from.monthlyCents * daysRemaining) / daysInPeriod);
  const charged = Math.round((to.monthlyCents * daysRemaining) / daysInPeriod);
  return {
    description: `Change from ${from.name} to ${to.name} (${daysRemaining} of ${daysInPeriod} days)`,
    amountCents: charged - unused,
  };
}
