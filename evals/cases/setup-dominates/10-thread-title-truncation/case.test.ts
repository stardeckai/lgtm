import { describe, expect, test } from "vitest";
import { threadTitle, type Message } from "./impl";

describe("threadTitle", () => {
  test("truncates a long opening message with an ellipsis", () => {
    const participants = [
      { id: "usr_1", name: "Priya Sharma", role: "agent", presence: "online", lastReadAt: "2024-05-04T10:02:00.000Z" },
      { id: "usr_2", name: "Tom Oduya", role: "customer", presence: "offline", lastReadAt: "2024-05-04T09:40:00.000Z" },
      { id: "usr_3", name: "Ines Vidal", role: "supervisor", presence: "away", lastReadAt: null },
      { id: "usr_4", name: "Bot", role: "assistant", presence: "online", lastReadAt: "2024-05-04T10:02:00.000Z" },
    ];
    const messages: Message[] = Array.from({ length: 18 }, (_, i) => ({
      id: `msg_${i}`,
      authorId: participants[i % participants.length]!.id,
      body:
        i === 0
          ? "We were charged twice for the March renewal and the second charge has not been refunded yet"
          : `Follow up number ${i} about the duplicate charge`,
      sentAt: `2024-05-04T09:${String(i).padStart(2, "0")}:00.000Z`,
    }));
    const attachments = messages
      .filter((_, i) => i % 5 === 0)
      .map((m) => ({ messageId: m.id, filename: `receipt-${m.id}.pdf`, sizeBytes: 22_000, contentType: "application/pdf" }));
    const reactions = messages.map((m) => ({ messageId: m.id, emoji: ":eyes:", byUserId: "usr_3" }));
    const readReceipts = participants.flatMap((p) => messages.slice(0, 6).map((m) => ({ userId: p.id, messageId: m.id })));

    expect(threadTitle(messages, 40)).toBe("We were charged twice for the March ren…");
  });
});
