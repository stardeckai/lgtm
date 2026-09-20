export interface Cache {
  del(key: string): Promise<void>;
}

export type PriceUpdate = { orgId: string; sku: string; channel: "web" | "pos" | "all" };

export function keysFor(update: PriceUpdate): string[] {
  const channels = update.channel === "all" ? ["web", "pos"] : [update.channel];
  return channels.map((c) => `price:${update.orgId}:${c}:${update.sku}`);
}

export async function invalidatePrices(cache: Cache, update: PriceUpdate): Promise<number> {
  const keys = keysFor(update);
  for (const key of keys) await cache.del(key);
  return keys.length;
}
