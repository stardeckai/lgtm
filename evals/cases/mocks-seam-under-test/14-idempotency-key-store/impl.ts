export type StoredResponse = { status: number; body: string };

export interface IdempotencyStore {
  claim(key: string, ttlSeconds: number): Promise<boolean>;
  read(key: string): Promise<StoredResponse | null>;
  write(key: string, response: StoredResponse): Promise<void>;
}

export async function withIdempotency(
  store: IdempotencyStore,
  key: string,
  handler: () => Promise<StoredResponse>,
): Promise<StoredResponse> {
  const existing = await store.read(key);
  if (existing) return existing;
  const claimed = await store.claim(key, 86_400);
  if (!claimed) {
    const concurrent = await store.read(key);
    if (concurrent) return concurrent;
    return { status: 409, body: "request already in flight" };
  }
  const response = await handler();
  await store.write(key, response);
  return response;
}
