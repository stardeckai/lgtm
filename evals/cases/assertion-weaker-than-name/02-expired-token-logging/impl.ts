export type Attempt = { tokenId: string; reason: string; atMs: number };

export type Token = { id: string; subject: string; expiresAtMs: number };

export class Authenticator {
  readonly rejected: Attempt[] = [];

  constructor(private readonly tokens: Map<string, Token>) {}

  authenticate(tokenId: string, nowMs: number): string | null {
    const token = this.tokens.get(tokenId);
    if (!token) {
      this.rejected.push({ tokenId, reason: "unknown", atMs: nowMs });
      return null;
    }
    if (token.expiresAtMs <= nowMs) {
      this.rejected.push({ tokenId, reason: "expired", atMs: nowMs });
      return null;
    }
    return token.subject;
  }
}
