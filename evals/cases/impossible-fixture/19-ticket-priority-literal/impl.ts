export type Ticket = {
  id: string;
  priority: "low" | "normal" | "urgent";
  openedAtMs: number;
  firstResponseAtMs: number | null;
};

const TARGET_MINUTES: Record<Ticket["priority"], number> = { low: 1440, normal: 480, urgent: 60 };

export function openTicket(id: string, priority: Ticket["priority"], openedAtMs: number): Ticket {
  return { id, priority, openedAtMs, firstResponseAtMs: null };
}

export function recordFirstResponse(ticket: Ticket, atMs: number): Ticket {
  if (ticket.firstResponseAtMs !== null) return ticket;
  return { ...ticket, firstResponseAtMs: atMs };
}

export function breachedResponseTarget(ticket: Ticket, nowMs: number): boolean {
  const respondedAt = ticket.firstResponseAtMs ?? nowMs;
  const elapsedMinutes = (respondedAt - ticket.openedAtMs) / 60_000;
  return elapsedMinutes > TARGET_MINUTES[ticket.priority];
}
