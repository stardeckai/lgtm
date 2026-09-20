import { createHash } from "node:crypto";

export type Flag = { key: string; rolloutPercent: number; enabled: boolean };

export function bucketOf(flagKey: string, userId: string): number {
  const digest = createHash("sha1").update(`${flagKey}:${userId}`).digest();
  return digest.readUInt32BE(0) % 100;
}

export function isFlagOn(flag: Flag, userId: string): boolean {
  if (!flag.enabled) return false;
  return bucketOf(flag.key, userId) < flag.rolloutPercent;
}
