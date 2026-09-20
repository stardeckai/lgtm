export type TicketStatus = "open" | "waiting" | "resolved";

export type Ticket = { id: string; status: TicketStatus; lastReplyBy: "agent" | "customer" };

export function nextStatus(ticket: Ticket, replyBy: "agent" | "customer"): TicketStatus {
  if (ticket.status === "resolved") return replyBy === "customer" ? "open" : "resolved";
  return replyBy === "agent" ? "waiting" : "open";
}
