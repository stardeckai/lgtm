export type Notification = { userId: string; channel: "email" | "push"; subject: string };

export function groupForDigest(items: Notification[]): Record<string, Notification[]> {
  const groups: Record<string, Notification[]> = {};
  for (const item of items) {
    const key = item.userId;
    (groups[key] ??= []).push(item);
  }
  return groups;
}
