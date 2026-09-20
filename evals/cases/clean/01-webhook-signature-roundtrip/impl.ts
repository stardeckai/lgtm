import { createHmac, timingSafeEqual } from "node:crypto";

export function signPayload(secret: string, body: string, timestampSeconds: number): string {
  const mac = createHmac("sha256", secret).update(`${timestampSeconds}.${body}`).digest("hex");
  return `t=${timestampSeconds},v1=${mac}`;
}

export function verifyPayload(
  secret: string,
  body: string,
  header: string,
  nowSeconds: number,
): boolean {
  const parts = new Map(header.split(",").map((part) => part.split("=") as [string, string]));
  const timestamp = Number(parts.get("t"));
  if (!Number.isFinite(timestamp) || Math.abs(nowSeconds - timestamp) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
  const given = Buffer.from(parts.get("v1") ?? "", "hex");
  const want = Buffer.from(expected, "hex");
  return given.length === want.length && timingSafeEqual(given, want);
}
