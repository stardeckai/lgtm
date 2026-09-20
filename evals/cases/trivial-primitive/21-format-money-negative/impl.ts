const MINOR_UNITS: Record<string, number> = { JPY: 0, KRW: 0, BHD: 3 };

export function formatMoney(minorAmount: number, currency: string): string {
  const digits = MINOR_UNITS[currency] ?? 2;
  const negative = minorAmount < 0;
  const whole = Math.abs(minorAmount) / 10 ** digits;
  const [integerPart, fraction = ""] = whole.toFixed(digits).split(".");
  const grouped = (integerPart ?? "0").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const body = digits === 0 ? grouped : `${grouped}.${fraction}`;
  return negative ? `-${currency} ${body}` : `${currency} ${body}`;
}
