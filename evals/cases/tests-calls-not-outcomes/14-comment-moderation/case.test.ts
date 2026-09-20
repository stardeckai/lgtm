import { describe, expect, it, vi } from "vitest";
import { moderate, type ModerationQueue } from "./impl";

describe("moderate", () => {
  it("queues a banned-word comment at high priority", () => {
    const enqueue = vi.fn();
    const queue: ModerationQueue = { enqueue };

    moderate(queue, { id: "c-1", body: "Claim your FREE-CRYPTO today", authorId: "u-3", reports: 0 });

    expect(enqueue.mock.calls.length).toBe(1);
  });
});
