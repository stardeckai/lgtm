export type Flag = { key: string; rolloutPercent: number; allowList: string[] };

function bucketOf(flagKey: string, userId: string): number {
  let hash = 2166136261;
  for (const char of `${flagKey}:${userId}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash % 100;
}

export function isEnabled(flag: Flag, userId: string): boolean {
  if (flag.allowList.includes(userId)) return true;
  if (flag.rolloutPercent <= 0) return false;
  return bucketOf(flag.key, userId) < flag.rolloutPercent;
}
