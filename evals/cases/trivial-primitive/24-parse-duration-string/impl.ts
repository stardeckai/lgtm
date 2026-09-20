const UNIT_MS: Record<string, number> = { ms: 1, s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 };

export function parseDuration(input: string): number {
  const matches = [...input.trim().matchAll(/(\d+)(ms|[smhd])/g)];
  if (matches.length === 0) throw new Error(`cannot parse duration "${input}"`);
  const consumed = matches.reduce((length, match) => length + match[0].length, 0);
  if (consumed !== input.trim().length) throw new Error(`cannot parse duration "${input}"`);
  return matches.reduce((total, match) => total + Number(match[1]) * (UNIT_MS[match[2]!] ?? 0), 0);
}
