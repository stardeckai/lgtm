export type BillingCycle = { anchorDay: number; timeZoneOffsetMinutes: number };

export function nextBillingDate(cycle: BillingCycle, fromIso: string): string {
  const from = new Date(Date.parse(fromIso) + cycle.timeZoneOffsetMinutes * 60_000);
  let year = from.getUTCFullYear();
  let month = from.getUTCMonth();
  if (from.getUTCDate() >= cycle.anchorDay) month += 1;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const day = Math.min(cycle.anchorDay, daysInMonth);
  const target = new Date(Date.UTC(year, month, day));
  return target.toISOString().slice(0, 10);
}
