import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashToken(token: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(token, salt, 32);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export function verifyToken(token: string, stored: string): boolean {
  const [scheme, saltHex, digestHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !digestHex) return false;
  const derived = scryptSync(token, Buffer.from(saltHex, "hex"), 32);
  const want = Buffer.from(digestHex, "hex");
  return derived.length === want.length && timingSafeEqual(derived, want);
}
