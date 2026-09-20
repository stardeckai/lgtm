export type RawRow = Record<string, string>;
export type Contact = { email: string; name: string; tags: string[] };

export const steps = {
  normalize(rows: RawRow[]): RawRow[] {
    return rows.map((r) => ({ ...r, email: (r.email ?? "").trim().toLowerCase() }));
  },
  dedupe(rows: RawRow[]): RawRow[] {
    const seen = new Set<string>();
    return rows.filter((r) => (seen.has(r.email!) ? false : (seen.add(r.email!), true)));
  },
  toContacts(rows: RawRow[]): Contact[] {
    return rows
      .filter((r) => r.email!.includes("@"))
      .map((r) => ({ email: r.email!, name: r.name ?? "", tags: (r.tags ?? "").split(",").filter(Boolean) }));
  },
};

export function importContacts(rows: RawRow[]): Contact[] {
  return steps.toContacts(steps.dedupe(steps.normalize(rows)));
}
