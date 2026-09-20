export type SessionPolicy = { idleMinutes: number; absoluteHours: number; rememberDevice: boolean };

export function sessionTtlSeconds(policy: SessionPolicy): number {
  const idle = policy.idleMinutes * 60;
  const absolute = policy.absoluteHours * 3600;
  const ttl = Math.min(idle, absolute);
  return policy.rememberDevice ? ttl * 2 : ttl;
}
