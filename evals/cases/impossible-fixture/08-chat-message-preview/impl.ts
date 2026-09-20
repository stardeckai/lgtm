export type ChatMessage = { id: string; authorId: string; body: string; sentAt: number };

export function acceptIncoming(raw: { id: string; authorId: string; body: string }): ChatMessage {
  const body = raw.body.trim();
  if (body.length === 0) throw new Error("cannot send an empty message");
  if (body.length > 4000) throw new Error("message too long");
  return { id: raw.id, authorId: raw.authorId, body, sentAt: Date.now() };
}

export function threadPreview(messages: ChatMessage[]): string {
  const last = messages[messages.length - 1];
  if (!last) return "No messages yet";
  return last.body.length > 40 ? `${last.body.slice(0, 40)}…` : last.body;
}
