export type Session = { id: string; userId: string; expiresAt: number; ip: string };

export interface SessionStore {
  put(session: Session): Promise<void>;
  byId(id: string): Promise<Session | null>;
  deleteForUser(userId: string): Promise<number>;
}

export async function startSession(
  store: SessionStore,
  userId: string,
  ip: string,
  nowMs: number,
  singleDevice: boolean,
): Promise<Session> {
  if (singleDevice) await store.deleteForUser(userId);
  const session: Session = {
    id: `sess_${userId}_${nowMs.toString(36)}`,
    userId,
    expiresAt: nowMs + 12 * 60 * 60 * 1000,
    ip,
  };
  await store.put(session);
  return session;
}
