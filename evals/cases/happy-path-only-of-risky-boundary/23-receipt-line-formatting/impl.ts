export type ReceiptLine = { name: string; qty: number; unitCents: number };

export function receiptBody(lines: ReceiptLine[], width: number): string[] {
  return lines.map((line) => {
    const label = `${line.qty} x ${line.name}`;
    const amount = ((line.qty * line.unitCents) / 100).toFixed(2);
    const padding = Math.max(1, width - label.length - amount.length);
    return `${label}${" ".repeat(padding)}${amount}`;
  });
}
