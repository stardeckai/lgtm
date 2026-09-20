export type Receipt = { orderId: string; customerName: string; lines: Array<{ label: string; cents: number }>; currency: string };
export type Transport = { send: (message: { to: string; subject: string; text: string }) => Promise<{ id: string }> };

function money(cents: number, currency: string): string {
  return `${(cents / 100).toFixed(2)} ${currency}`;
}

export function renderReceipt(receipt: Receipt): { subject: string; text: string } {
  const total = receipt.lines.reduce((sum, line) => sum + line.cents, 0);
  const body = receipt.lines.map((line) => `${line.label}: ${money(line.cents, receipt.currency)}`).join("\n");
  return {
    subject: `Receipt for order ${receipt.orderId}`,
    text: `Hi ${receipt.customerName},\n\n${body}\n\nTotal: ${money(total, receipt.currency)}\n`,
  };
}

export async function sendReceipt(transport: Transport, to: string, receipt: Receipt): Promise<string> {
  const rendered = renderReceipt(receipt);
  const result = await transport.send({ to, ...rendered });
  return result.id;
}
