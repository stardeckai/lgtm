import { createHmac } from "node:crypto";

export type Claims = { sub: string; scopes: string[]; exp: number };

export function issue(secret: string, claims: Claims): string {
  const body = Buffer.from(JSON.stringify(claims)).toString("base64url");
  const mac = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${mac}`;
}

export function read(secret: string, token: string): Claims {
  const [body, mac] = token.split(".");
  if (!body || !mac) throw new Error("malformed token");
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  if (expected !== mac) throw new Error("bad signature");
  return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Claims;
}
