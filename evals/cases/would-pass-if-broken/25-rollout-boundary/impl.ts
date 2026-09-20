export type Rollout = { percent: number; overrides: Record<string, boolean> };

export function inRollout(rollout: Rollout, userId: string, bucket: number): boolean {
  const override = rollout.overrides[userId];
  if (override !== undefined) return override;
  if (bucket < 0 || bucket > 99) throw new RangeError(`bucket out of range: ${bucket}`);
  return bucket < rollout.percent;
}
