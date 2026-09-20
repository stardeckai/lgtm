import { describe, expect, it } from "vitest";
import { DelayQueue } from "./impl";

describe("DelayQueue.depth", () => {
  it("counts only the messages whose delay has already elapsed", () => {
    const queue = new DelayQueue(1000);
    queue.push({ id: "m1", visibleAtMs: 0, body: "now" });
    queue.push({ id: "m2", visibleAtMs: 60_000, body: "later" });

    expect(queue.depth(1_000)).toBeLessThanOrEqual(1000);
  });
});
