function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

export function nextBillingDate(anchorDay: number, year: number, monthIndex: number): string {
  const day = Math.min(anchorDay, daysInMonth(year, monthIndex));
  const month = String(monthIndex + 1).padStart(2, "0");
  return `${year}-${month}-${String(day).padStart(2, "0")}`;
}
