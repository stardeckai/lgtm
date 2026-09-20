export type ApiTicket = {
  id: string;
  subject: string;
  requester: { id: string; name: string; email: string };
  assignee: { id: string; name: string; email: string } | null;
  tags: string[];
  comments: { id: string; authorId: string; body: string; at: string }[];
};

export function normalize(tickets: ApiTicket[]) {
  const users: Record<string, { id: string; name: string; email: string }> = {};
  const comments: Record<string, { id: string; ticketId: string; authorId: string; body: string; at: string }> = {};
  const byId: Record<string, { id: string; subject: string; requesterId: string; assigneeId: string | null; tags: string[]; commentIds: string[] }> = {};
  for (const ticket of tickets) {
    users[ticket.requester.id] = ticket.requester;
    if (ticket.assignee) users[ticket.assignee.id] = ticket.assignee;
    for (const comment of ticket.comments) comments[comment.id] = { ...comment, ticketId: ticket.id };
    byId[ticket.id] = {
      id: ticket.id,
      subject: ticket.subject,
      requesterId: ticket.requester.id,
      assigneeId: ticket.assignee?.id ?? null,
      tags: [...new Set(ticket.tags)].sort(),
      commentIds: ticket.comments.map((c) => c.id),
    };
  }
  return { tickets: byId, users, comments, ids: Object.keys(byId) };
}
