export type ResetToken = { token: string; userId: string; issuedAtMs: number; usedAt?: number };

export const TOKEN_TTL_MS = 15 * 60 * 1000;

export class ResetTokens {
  private tokens = new Map<string, ResetToken>();

  issue(userId: string, token: string, nowMs: number): void {
    this.tokens.set(token, { token, userId, issuedAtMs: nowMs });
  }

  redeem(token: string, nowMs: number): string | null {
    const found = this.tokens.get(token);
    if (!found || found.usedAt !== undefined) return null;
    found.usedAt = nowMs;
    return found.userId;
  }
}
