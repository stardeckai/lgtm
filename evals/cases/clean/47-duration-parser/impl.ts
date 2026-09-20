const UNITS: Record<string, number> = { ms: 1, s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };

export function parseDuration(text: string): number {
  const trimmed = text.trim();
  if (trimmed === "") throw new SyntaxError("empty duration");
  const pattern = /(-?\d+(?:\.\d+)?)(ms|[smhd])/g;
  let total = 0;
  let consumed = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(trimmed)) !== null) {
    if (match.index !== consumed) throw new SyntaxError(`unexpected character at ${match.index}`);
    consumed = match.index + match[0].length;
    total += Number(match[1]) * UNITS[match[2]!]!;
  }
  if (consumed !== trimmed.length) throw new SyntaxError(`unexpected character at ${consumed}`);
  return total;
}

export function formatDuration(ms: number): string {
  if (ms === 0) return "0s";
  const parts: string[] = [];
  let left = Math.abs(ms);
  for (const unit of ["d", "h", "m", "s", "ms"]) {
    const size = UNITS[unit]!;
    const count = Math.floor(left / size);
    if (count > 0) parts.push(`${count}${unit}`);
    left -= count * size;
  }
  return (ms < 0 ? "-" : "") + parts.join("");
}
