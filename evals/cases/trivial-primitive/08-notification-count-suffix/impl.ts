export function pluralise(count: number, noun: string): string {
  return count === 1 ? `1 ${noun}` : `${count} ${noun}s`;
}

export function inboxSummary(unread: number, mentions: number): string {
  return `${pluralise(unread, "message")}, ${pluralise(mentions, "mention")}`;
}
