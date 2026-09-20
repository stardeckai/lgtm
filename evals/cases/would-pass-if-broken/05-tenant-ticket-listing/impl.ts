export type Ticket = { id: string; tenantId: string; subject: string; closed: boolean };

export class TicketStore {
  private rows: Ticket[] = [];

  insert(ticket: Ticket): void {
    this.rows.push(ticket);
  }

  listOpen(tenantId: string): Ticket[] {
    return this.rows
      .filter((row) => row.tenantId === tenantId)
      .filter((row) => !row.closed)
      .sort((a, b) => a.id.localeCompare(b.id));
  }
}
