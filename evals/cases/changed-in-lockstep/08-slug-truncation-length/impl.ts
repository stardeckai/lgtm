const MAX_SLUG_LENGTH = 80;

export function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (base.length <= MAX_SLUG_LENGTH) return base;
  return base.slice(0, MAX_SLUG_LENGTH).replace(/-$/, "");
}
