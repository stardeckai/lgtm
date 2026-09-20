export function addMonthsClamped(isoDate: string, months: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const anchorDay = date.getUTCDate();
  const shifted = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const daysInTargetMonth = new Date(
    Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, 0),
  ).getUTCDate();
  shifted.setUTCDate(Math.min(anchorDay, daysInTargetMonth));
  return shifted.toISOString().slice(0, 10);
}
