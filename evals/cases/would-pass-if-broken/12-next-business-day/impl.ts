const HOLIDAYS = new Set(["2026-01-01", "2026-07-04", "2026-12-25"]);

function iso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function nextBusinessDay(fromIso: string): string {
  const cursor = new Date(`${fromIso}T00:00:00Z`);
  for (let step = 0; step < 14; step += 1) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const day = cursor.getUTCDay();
    if (day === 0 || day === 6) continue;
    if (HOLIDAYS.has(iso(cursor))) continue;
    return iso(cursor);
  }
  throw new Error(`no business day found within 14 days of ${fromIso}`);
}
