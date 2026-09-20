export interface Bucketer {
  bucketOf(flagKey: string, userId: string): number;
}

export const fnvBucketer: Bucketer = {
  bucketOf(flagKey, userId) {
    let hash = 0x811c9dc5;
    for (const char of `${flagKey}:${userId}`) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash % 100;
  },
};

export type Flag = { key: string; rolloutPercent: number; enabled: boolean };

export function isEnabledFor(bucketer: Bucketer, flag: Flag, userId: string): boolean {
  if (!flag.enabled) return false;
  if (flag.rolloutPercent >= 100) return true;
  return bucketer.bucketOf(flag.key, userId) < flag.rolloutPercent;
}
