export type InvoiceSeed = { sequence: number; issuedAt: Date };

export function invoiceNumber(seed: InvoiceSeed): string {
  return `${seed.issuedAt.getUTCFullYear()}-INV-${seed.sequence}`;
}

export function parseSequence(number: string): number {
  const digits = number.split("-").pop() ?? "";
  return Number.parseInt(digits, 10);
}
