export function nextBillingDate(anchorDay: number, year: number, monthIndex: number): string {
  const month = String(monthIndex + 1).padStart(2, "0");
  const day = String(anchorDay).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
