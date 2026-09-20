export type SemVer = { major: number; minor: number; patch: number };

export function parseVersion(text: string): SemVer {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(text.trim());
  if (!match) throw new SyntaxError(`not a version: ${text}`);
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
}

function compare(a: SemVer, b: SemVer): number {
  return a.major - b.major || a.minor - b.minor || a.patch - b.patch;
}

export function satisfiesCaret(version: string, range: string): boolean {
  const target = parseVersion(range.replace(/^\^/, ""));
  const actual = parseVersion(version);
  if (compare(actual, target) < 0) return false;
  if (target.major > 0) return actual.major === target.major;
  if (target.minor > 0) return actual.major === 0 && actual.minor === target.minor;
  return actual.major === 0 && actual.minor === 0 && actual.patch === target.patch;
}
