export type FeatureFlag = { key: string; enabled: boolean; rolloutPercent: number };

export function parseFlag(raw: Record<string, unknown>): FeatureFlag {
  const rollout = Number(raw.rolloutPercent);
  if (typeof raw.key !== "string" || raw.key.length === 0) throw new Error("flag key required");
  if (!Number.isInteger(rollout) || rollout < 0 || rollout > 100) {
    throw new Error("rolloutPercent must be an integer between 0 and 100");
  }
  return { key: raw.key, enabled: raw.enabled === true, rolloutPercent: rollout };
}

function bucket(key: string, userId: string): number {
  let hash = 0;
  for (const char of `${key}:${userId}`) hash = (hash * 31 + char.charCodeAt(0)) % 100;
  return hash;
}

export function isOn(flag: FeatureFlag, userId: string): boolean {
  if (!flag.enabled) return false;
  return bucket(flag.key, userId) < flag.rolloutPercent;
}
