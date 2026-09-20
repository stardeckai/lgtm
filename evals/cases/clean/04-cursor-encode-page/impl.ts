export type Cursor = { createdAt: number; id: string };

export function encodeCursor(cursor: Cursor): string {
  return Buffer.from(`${cursor.createdAt}|${cursor.id}`, "utf8").toString("base64url");
}

export function decodeCursor(raw: string): Cursor {
  const [createdAt, ...rest] = Buffer.from(raw, "base64url").toString("utf8").split("|");
  const id = rest.join("|");
  if (!id || !/^\d+$/.test(createdAt ?? "")) throw new Error("malformed cursor");
  return { createdAt: Number(createdAt), id };
}

export type Row = { id: string; createdAt: number };

export function fetchPage(rows: Row[], after: string | null, size: number): { rows: Row[]; next: string | null } {
  const sorted = [...rows].sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id));
  const start = after === null ? 0 : sorted.findIndex((r) => {
    const cursor = decodeCursor(after);
    return r.createdAt > cursor.createdAt || (r.createdAt === cursor.createdAt && r.id > cursor.id);
  });
  const slice = start === -1 ? [] : sorted.slice(start, start + size);
  const last = slice[slice.length - 1];
  return { rows: slice, next: last && start + size < sorted.length ? encodeCursor(last) : null };
}
