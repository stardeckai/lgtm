export type ResetToken = { hash: string; userId: string; expiresAt: number; usedAt: number | null };

export interface TokenStore {
  find(hash: string): Promise<ResetToken | null>;
  markUsed(hash: string, atMs: number): Promise<boolean>;
}

export interface Hasher {
  hash(raw: string): string;
}

export class ResetError extends Error {}

export async function consumeResetToken(
  store: TokenStore,
  hasher: Hasher,
  raw: string,
  nowMs: number,
): Promise<string> {
  const token = await store.find(hasher.hash(raw));
  if (!token) throw new ResetError("unknown token");
  if (token.usedAt !== null) throw new ResetError("token already used");
  if (token.expiresAt <= nowMs) throw new ResetError("token expired");
  const claimed = await store.markUsed(token.hash, nowMs);
  if (!claimed) throw new ResetError("token already used");
  return token.userId;
}
