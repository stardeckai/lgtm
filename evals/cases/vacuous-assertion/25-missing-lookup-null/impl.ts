export type ApiKey = { hash: string; orgId: string; revokedAtMs: number | null };

export class KeyDirectory {
  private keys = new Map<string, ApiKey>();

  add(key: ApiKey): void {
    this.keys.set(key.hash, key);
  }

  resolve(hash: string, nowMs: number): ApiKey | null {
    const key = this.keys.get(hash);
    if (!key) return null;
    if (key.revokedAtMs !== null && key.revokedAtMs <= nowMs) return null;
    return key;
  }
}
