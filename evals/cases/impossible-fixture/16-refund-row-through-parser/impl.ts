export type RefundRow = { id: string; chargeId: string; amountCents: number; status: "pending" | "settled" };

export function parseRefundRow(raw: Record<string, unknown>): RefundRow {
  const amount = Number(raw.amountCents);
  if (typeof raw.id !== "string" || typeof raw.chargeId !== "string") throw new Error("refund ids required");
  if (!Number.isInteger(amount) || amount <= 0) throw new Error("refund amount must be a positive integer");
  if (raw.status !== "pending" && raw.status !== "settled") throw new Error("unknown refund status");
  return { id: raw.id, chargeId: raw.chargeId, amountCents: amount, status: raw.status };
}

export function outstandingRefundCents(rows: RefundRow[]): number {
  return rows.filter((row) => row.status === "pending").reduce((sum, row) => sum + row.amountCents, 0);
}
