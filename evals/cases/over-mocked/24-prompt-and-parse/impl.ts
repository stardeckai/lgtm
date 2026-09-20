export type Receipt = { vendor: string; totalCents: number; lines: { label: string; cents: number }[] };

export interface Model {
  complete(prompt: string): Promise<string>;
}

export function buildPrompt(rawText: string): string {
  return [
    "Extract the vendor, the total and each line item from this receipt.",
    "Reply with JSON only: {vendor, total_cents, lines:[{label, cents}]}",
    "---",
    rawText.trim(),
  ].join("\n");
}

export function parseReceipt(reply: string): Receipt {
  const json = reply.slice(reply.indexOf("{"), reply.lastIndexOf("}") + 1);
  const raw = JSON.parse(json) as { vendor: string; total_cents: number; lines: { label: string; cents: number }[] };
  const lines = raw.lines.map((l) => ({ label: l.label.trim(), cents: Math.round(l.cents) }));
  const sum = lines.reduce((n, l) => n + l.cents, 0);
  if (sum !== raw.total_cents) throw new Error(`line items ${sum} do not add up to total ${raw.total_cents}`);
  return { vendor: raw.vendor.trim(), totalCents: raw.total_cents, lines };
}

export async function scanReceipt(model: Model, rawText: string): Promise<Receipt> {
  return parseReceipt(await model.complete(buildPrompt(rawText)));
}
