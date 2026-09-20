import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEYLEN = 32;

export function hashPassword(password: string, salt: Buffer = randomBytes(16)): string {
  const derived = scryptSync(password.normalize("NFKC"), salt, KEYLEN);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const derived = scryptSync(password.normalize("NFKC"), Buffer.from(saltHex, "hex"), KEYLEN);
  const expected = Buffer.from(hashHex, "hex");
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}
