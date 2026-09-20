export type Session = { userId: string; expiresAt: number; revoked: boolean };

export function isSessionValid(session: Session, nowMs: number): boolean {
  return session.expiresAt > nowMs;
}
