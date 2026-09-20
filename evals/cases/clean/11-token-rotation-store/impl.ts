export type RefreshToken = { token: string; userId: string; familyId: string; revoked: boolean };

export class TokenStore {
  private tokens = new Map<string, RefreshToken>();

  save(token: RefreshToken): void {
    this.tokens.set(token.token, token);
  }

  get(token: string): RefreshToken | undefined {
    return this.tokens.get(token);
  }

  revokeFamily(familyId: string): void {
    for (const token of this.tokens.values()) {
      if (token.familyId === familyId) token.revoked = true;
    }
  }
}

export function rotate(store: TokenStore, presented: string, mint: () => string): { token: string } | { error: string } {
  const existing = store.get(presented);
  if (!existing) return { error: "unknown token" };
  if (existing.revoked) {
    store.revokeFamily(existing.familyId);
    return { error: "token reuse detected" };
  }
  existing.revoked = true;
  const next = mint();
  store.save({ token: next, userId: existing.userId, familyId: existing.familyId, revoked: false });
  return { token: next };
}
