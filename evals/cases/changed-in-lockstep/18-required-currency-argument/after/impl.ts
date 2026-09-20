const DECIMALS: Record<string, number> = { USD: 2, EUR: 2, JPY: 0, KWD: 3 };

export function formatMinor(minor: number, currency: string): string {
  const digits = DECIMALS[currency];
  if (digits === undefined) throw new RangeError(`unknown currency ${currency}`);
  const sign = minor < 0 ? "-" : "";
  const abs = Math.abs(minor);
  const unit = 10 ** digits;
  if (digits === 0) return `${sign}${abs}`;
  return `${sign}${Math.floor(abs / unit)}.${String(abs % unit).padStart(digits, "0")}`;
}
