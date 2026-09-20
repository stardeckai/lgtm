export type Comment = { id: string; body: string; authorId: string; reports: number };

export interface ModerationQueue {
  enqueue(item: { commentId: string; priority: "low" | "high"; reason: string }): void;
}

const BANNED = ["scam-link", "free-crypto"];

export function moderate(queue: ModerationQueue, comment: Comment): "clean" | "queued" {
  const hit = BANNED.find((word) => comment.body.toLowerCase().includes(word));
  if (hit) {
    queue.enqueue({ commentId: comment.id, priority: "high", reason: `banned:${hit}` });
    return "queued";
  }
  if (comment.reports >= 3) {
    queue.enqueue({ commentId: comment.id, priority: "low", reason: "reports" });
    return "queued";
  }
  return "clean";
}
