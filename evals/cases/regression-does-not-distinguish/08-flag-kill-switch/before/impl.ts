export type Flag = { key: string; rolloutPercent: number; killed: boolean };

function bucket(key: string, userId: string): number {
  let hash = 2166136261;
  for (const char of `${key}:${userId}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash % 100;
}

export function isEnabled(flag: Flag, userId: string): boolean {
  return bucket(flag.key, userId) < flag.rolloutPercent;
}
