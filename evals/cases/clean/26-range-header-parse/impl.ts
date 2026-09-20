export type ByteRange = { start: number; end: number };

export function parseRange(header: string, size: number): ByteRange[] | "unsatisfiable" | null {
  const match = /^bytes=(.+)$/.exec(header.trim());
  if (!match) return null;
  const ranges: ByteRange[] = [];
  for (const spec of match[1]!.split(",")) {
    const [rawStart, rawEnd] = spec.trim().split("-");
    if (rawStart === "" && rawEnd !== undefined && rawEnd !== "") {
      const length = Number(rawEnd);
      if (!Number.isInteger(length) || length <= 0) return null;
      ranges.push({ start: Math.max(0, size - length), end: size - 1 });
      continue;
    }
    const start = Number(rawStart);
    if (!Number.isInteger(start) || start < 0) return null;
    if (start >= size) return "unsatisfiable";
    const end = rawEnd === "" || rawEnd === undefined ? size - 1 : Math.min(Number(rawEnd), size - 1);
    if (!Number.isInteger(end) || end < start) return null;
    ranges.push({ start, end });
  }
  return ranges;
}
