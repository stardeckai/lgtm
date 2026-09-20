export type InvoiceSeed = { sequence: number; issuedAt: Date };

export function invoiceNumber(seed: InvoiceSeed): string {
  return `INV-${String(seed.sequence).padStart(4, "0")}`;
}

export function parseSequence(number: string): number {
  const digits = number.split("-").pop() ?? "";
  return Number.parseInt(digits, 10);
}
