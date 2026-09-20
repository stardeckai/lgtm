const RESERVED = new Set(["admin", "api", "www", "settings"]);

export function slugify(name: string, taken: Set<string>): string {
  const base = name
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-{2,}/g, "-")
    .slice(0, 40)
    .replace(/^-|-$/g, "");
  const safe = base === "" || RESERVED.has(base) ? `${base}-workspace` : base;
  let candidate = safe;
  let suffix = 2;
  while (taken.has(candidate)) {
    candidate = `${safe}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}
