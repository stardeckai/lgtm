export const IDLE_TIMEOUT_MS = 120 * 60 * 1000;

export type Session = { id: string; lastSeenMs: number };

export function isExpired(session: Session, nowMs: number): boolean {
  return nowMs - session.lastSeenMs >= IDLE_TIMEOUT_MS;
}

export function touch(session: Session, nowMs: number): Session {
  return { ...session, lastSeenMs: nowMs };
}
