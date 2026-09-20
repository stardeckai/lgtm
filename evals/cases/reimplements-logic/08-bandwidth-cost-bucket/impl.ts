const GB = 1024 * 1024 * 1024;

export type UsageBucket = { includedGb: number; overageCentsPerGb: number };

export const PLANS: Record<string, UsageBucket> = {
  starter: { includedGb: 100, overageCentsPerGb: 9 },
  growth: { includedGb: 1000, overageCentsPerGb: 6 },
};

export function bandwidthCostCents(plan: string, bytes: number): number {
  const bucket = PLANS[plan];
  if (!bucket) throw new Error(`unknown plan ${plan}`);
  const usedGb = Math.ceil(bytes / GB);
  const overGb = Math.max(0, usedGb - bucket.includedGb);
  return overGb * bucket.overageCentsPerGb;
}
