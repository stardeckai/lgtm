export class TokenExpired extends Error {
  constructor(readonly tokenId: string) {
    super(`token ${tokenId} expired`);
    this.name = "TokenExpired";
  }
}

export type Token = { id: string; subject: string; expiresAtMs: number };

export async function authenticate(
  load: (id: string) => Promise<Token | null>,
  id: string,
  nowMs: number,
): Promise<string> {
  const token = await load(id);
  if (!token) throw new Error(`unknown token ${id}`);
  if (token.expiresAtMs <= nowMs) throw new TokenExpired(id);
  return token.subject;
}
