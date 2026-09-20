export type Terms = "net15" | "net30" | "eom";

export type IssuedInvoice = { id: string; issuedAtIso: string; dueIso: string; graceEndsIso: string };

const DAY = 86_400_000;

export function issue(id: string, terms: Terms, now: () => Date, graceDays: number): IssuedInvoice {
  const issuedAt = now();
  let due: Date;
  if (terms === "net15") due = new Date(issuedAt.getTime() + 15 * DAY);
  else if (terms === "net30") due = new Date(issuedAt.getTime() + 30 * DAY);
  else due = new Date(Date.UTC(issuedAt.getUTCFullYear(), issuedAt.getUTCMonth() + 1, 0));
  return {
    id,
    issuedAtIso: issuedAt.toISOString(),
    dueIso: due.toISOString().slice(0, 10),
    graceEndsIso: new Date(due.getTime() + graceDays * DAY).toISOString().slice(0, 10),
  };
}
