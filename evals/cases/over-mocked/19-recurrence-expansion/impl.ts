export type Recurrence = { weekdays: number[]; startIso: string; count: number; skipIso: string[] };

const DAY_MS = 24 * 60 * 60 * 1000;

export function expandRecurrence(rule: Recurrence): string[] {
  const skip = new Set(rule.skipIso);
  const out: string[] = [];
  let cursor = new Date(rule.startIso).getTime();
  while (out.length < rule.count) {
    const date = new Date(cursor);
    const iso = date.toISOString().slice(0, 10);
    if (rule.weekdays.includes(date.getUTCDay()) && !skip.has(iso)) out.push(iso);
    cursor += DAY_MS;
  }
  return out;
}
