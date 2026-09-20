export type Line = {
  description: string;
  subtotalCents: number;
  taxRate: number;
};

export function lineTaxCents(line: Line): number {
  return Math.floor(line.subtotalCents * line.taxRate);
}

export function invoiceTotalCents(lines: Line[]): number {
  return lines.reduce(
    (sum, line) => sum + line.subtotalCents + lineTaxCents(line),
    0,
  );
}
