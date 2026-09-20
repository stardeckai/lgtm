import { createHmac, timingSafeEqual } from "node:crypto";

export type Ticket = { userId: string; roomId: string };

export function issueTicket(secret: string, ticket: Ticket, now: () => number, ttlSeconds: number): string {
  const expires = Math.floor(now() / 1000) + ttlSeconds;
  const payload = `${ticket.userId}:${ticket.roomId}:${expires}`;
  const mac = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}:${mac}`;
}

export function readTicket(secret: string, token: string, now: () => number): Ticket | null {
  const parts = token.split(":");
  if (parts.length !== 4) return null;
  const [userId, roomId, expires, mac] = parts as [string, string, string, string];
  const expected = createHmac("sha256", secret).update(`${userId}:${roomId}:${expires}`).digest("base64url");
  const given = Buffer.from(mac);
  const want = Buffer.from(expected);
  if (given.length !== want.length || !timingSafeEqual(given, want)) return null;
  if (Number(expires) * 1000 <= now()) return null;
  return { userId, roomId };
}
