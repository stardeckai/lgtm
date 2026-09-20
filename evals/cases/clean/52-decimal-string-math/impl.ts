export type Decimal = { units: bigint; scale: number };

export function parseDecimal(text: string): Decimal {
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(text.trim());
  if (!match) throw new SyntaxError(`not a decimal: ${text}`);
  const fraction = match[3] ?? "";
  const units = BigInt(`${match[1]}${match[2]}${fraction}`);
  return { units, scale: fraction.length };
}

function rescale(value: Decimal, scale: number): bigint {
  return value.units * 10n ** BigInt(scale - value.scale);
}

export function addDecimal(a: Decimal, b: Decimal): Decimal {
  const scale = Math.max(a.scale, b.scale);
  return { units: rescale(a, scale) + rescale(b, scale), scale };
}

export function formatDecimal(value: Decimal): string {
  const negative = value.units < 0n;
  const digits = (negative ? -value.units : value.units).toString().padStart(value.scale + 1, "0");
  const whole = digits.slice(0, digits.length - value.scale);
  const fraction = value.scale === 0 ? "" : `.${digits.slice(digits.length - value.scale)}`;
  return `${negative ? "-" : ""}${whole}${fraction}`;
}
