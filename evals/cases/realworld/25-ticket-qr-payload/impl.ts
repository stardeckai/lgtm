export const CANONICAL_QR_PATTERN = /^TICKET:[0-9a-f-]{36}:[A-Z0-9]{6,10}$/;

export function buildCanonicalQrPayload(ticketId: string, ticketCode: string): string {
  return `TICKET:${ticketId}:${ticketCode.toUpperCase()}`;
}

type TicketRow = { id: string; ticketCode: string; qrPayload: string | null };

export class TicketStore {
  private rows = new Map<string, TicketRow>();

  create(id: string, ticketCode: string): void {
    this.rows.set(id, { id, ticketCode, qrPayload: null });
  }

  /** The payload is minted on settlement, not at creation. */
  settle(id: string): void {
    const row = this.rows.get(id);
    if (!row) throw new Error(`unknown ticket ${id}`);
    row.qrPayload = buildCanonicalQrPayload(row.id, row.ticketCode);
  }

  get(id: string): TicketRow | undefined {
    return this.rows.get(id);
  }
}
