export type Message = { id: string; authorId: string; body: string; sentAt: string };

export function threadTitle(messages: Message[], maxLength: number): string {
  const first = messages[0];
  if (!first) return "(empty thread)";
  const oneLine = first.body.replace(/\s+/g, " ").trim();
  if (oneLine.length <= maxLength) return oneLine;
  return oneLine.slice(0, maxLength - 1).trimEnd() + "…";
}
