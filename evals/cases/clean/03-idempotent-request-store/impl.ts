export type StoredResponse = { status: number; body: string };

export class IdempotencyStore {
  private entries = new Map<string, { fingerprint: string; response: StoredResponse }>();

  begin(key: string, fingerprint: string): StoredResponse | "proceed" {
    const existing = this.entries.get(key);
    if (!existing) return "proceed";
    if (existing.fingerprint !== fingerprint) return { status: 422, body: "key reused with a different request" };
    return existing.response;
  }

  finish(key: string, fingerprint: string, response: StoredResponse): void {
    this.entries.set(key, { fingerprint, response });
  }
}

export function fingerprint(method: string, path: string, body: string): string {
  return `${method.toUpperCase()} ${path} ${body.length}:${body}`;
}

export function handle(
  store: IdempotencyStore,
  request: { key: string; method: string; path: string; body: string },
  run: () => StoredResponse,
): StoredResponse {
  const print = fingerprint(request.method, request.path, request.body);
  const seen = store.begin(request.key, print);
  if (seen !== "proceed") return seen;
  const response = run();
  store.finish(request.key, print, response);
  return response;
}
