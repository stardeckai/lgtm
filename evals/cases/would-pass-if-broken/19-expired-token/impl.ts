export class TokenExpiredError extends Error {
  constructor(public readonly expiredAt: number) {
    super(`token expired at ${expiredAt}`);
    this.name = "TokenExpiredError";
  }
}

export type Token = { subject: string; issuedAt: number; ttlSeconds: number };

export function authenticate(token: Token, nowSeconds: number): string {
  const expiresAt = token.issuedAt + token.ttlSeconds;
  if (nowSeconds >= expiresAt) throw new TokenExpiredError(expiresAt);
  if (token.subject.trim() === "") throw new Error("token has no subject");
  return token.subject;
}
