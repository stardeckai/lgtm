export type Comment = { id: string; createdAtMs: number; body: string };

export type Page = { items: Comment[]; nextCursor: string | null };

export function page(comments: Comment[], cursor: string | null, size: number): Page {
  const sorted = [...comments].sort((a, b) => b.createdAtMs - a.createdAtMs);
  const start = cursor === null ? 0 : sorted.findIndex((c) => c.id === cursor) + 1;
  const items = sorted.slice(start, start + size);
  const last = items[items.length - 1];
  const nextCursor = start + size < sorted.length && last ? last.id : null;
  return { items, nextCursor };
}
