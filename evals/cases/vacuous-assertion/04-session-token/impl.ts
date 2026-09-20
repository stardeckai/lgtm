import { randomBytes } from "node:crypto";

export type Session = { token: string; userId: string; expiresAtMs: number; scopes: string[] };

const TTL_MS = 30 * 60 * 1000;

export function createSession(userId: string, scopes: string[], nowMs: number): Session {
  const allowed = scopes.filter((scope) => scope !== "admin:*");
  return {
    token: `sess_${randomBytes(16).toString("hex")}`,
    userId,
    expiresAtMs: nowMs + TTL_MS,
    scopes: allowed,
  };
}
