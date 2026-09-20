export type Variant = "control" | "treatment";

export interface FlagBackend {
  fetch(key: string): Promise<{ variant: Variant; ttlMs: number }>;
}

export class FlagClient {
  private cache = new Map<string, { variant: Variant; expiresAt: number }>();
  constructor(
    private readonly backend: FlagBackend,
    private readonly now: () => number,
  ) {}

  async variantFor(key: string): Promise<Variant> {
    const hit = this.cache.get(key);
    const t = this.now();
    if (hit && hit.expiresAt > t) return hit.variant;
    const fresh = await this.backend.fetch(key);
    this.cache.set(key, { variant: fresh.variant, expiresAt: t + fresh.ttlMs });
    return fresh.variant;
  }
}
