export type Session = { userId: string; expiresAt: number; revoked: boolean };

export function isSessionValid(session: Session, nowMs: number): boolean {
  if (session.revoked) return false;
  return session.expiresAt > nowMs;
}
