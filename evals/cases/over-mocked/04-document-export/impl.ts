export interface Repository {
  load(id: string): Promise<{ id: string; title: string; blocks: { type: string; text: string }[] }>;
}
export interface Renderer {
  toPdf(doc: { title: string; blocks: { type: string; text: string }[] }): Promise<Uint8Array>;
}
export interface Storage {
  put(key: string, bytes: Uint8Array): Promise<{ url: string }>;
}
export interface Clock {
  now(): Date;
}

export async function exportDocument(
  repo: Repository,
  renderer: Renderer,
  storage: Storage,
  clock: Clock,
  id: string,
): Promise<{ url: string; key: string }> {
  const doc = await repo.load(id);
  const bytes = await renderer.toPdf(doc);
  const stamp = clock.now().toISOString().slice(0, 10);
  const key = `exports/${stamp}/${doc.id}.pdf`;
  const { url } = await storage.put(key, bytes);
  return { url, key };
}
