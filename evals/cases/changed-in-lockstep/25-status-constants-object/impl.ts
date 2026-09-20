export const TicketStatus = {
  Open: "open",
  Waiting: "waiting",
  Resolved: "resolved",
} as const;

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

export type Ticket = { id: string; status: TicketStatus; lastReplyBy: "agent" | "customer" };

export function nextStatus(ticket: Ticket, replyBy: "agent" | "customer"): TicketStatus {
  if (ticket.status === TicketStatus.Resolved) {
    return replyBy === "customer" ? TicketStatus.Open : TicketStatus.Resolved;
  }
  return replyBy === "agent" ? TicketStatus.Waiting : TicketStatus.Open;
}
