export type Event = { id: string; atMs: number };

export type Page = { items: Event[]; nextCursor: string | null };

export function page(events: Event[], cursor: string | null, size: number): Page {
  const sorted = [...events].sort((a, b) => b.atMs - a.atMs);
  const start = cursor === null ? 0 : sorted.findIndex((event) => event.id === cursor) + 1;
  const items = sorted.slice(start, start + size);
  const last = items[items.length - 1];
  const nextCursor = start + items.length < sorted.length && last ? last.id : null;
  return { items, nextCursor };
}
