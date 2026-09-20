export type Receipt = { number: string; customerName: string; lines: { label: string; cents: number }[]; taxCents: number };

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export function receiptHtml(receipt: Receipt): string {
  const rows = receipt.lines
    .map((line) => `<tr><td class="label">${line.label}</td><td class="amount">${money(line.cents)}</td></tr>`)
    .join("\n      ");
  const subtotal = receipt.lines.reduce((sum, l) => sum + l.cents, 0);
  return [
    `<html>`,
    `  <body style="font-family: Helvetica, Arial, sans-serif">`,
    `    <h1>Receipt ${receipt.number}</h1>`,
    `    <p>Thanks, ${receipt.customerName}.</p>`,
    `    <table class="lines">`,
    `      ${rows}`,
    `      <tr><td class="label">Tax</td><td class="amount">${money(receipt.taxCents)}</td></tr>`,
    `      <tr class="total"><td>Total</td><td>${money(subtotal + receipt.taxCents)}</td></tr>`,
    `    </table>`,
    `  </body>`,
    `</html>`,
  ].join("\n");
}
