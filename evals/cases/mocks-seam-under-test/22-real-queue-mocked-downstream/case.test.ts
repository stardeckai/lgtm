import { describe, expect, it, vi } from "vitest";
import { DelayQueue, pump, type Downstream } from "./impl";

describe("pump", () => {
  it("leaves a delayed message invisible until its delay has elapsed", async () => {
    let nowMs = 0;
    const queue = new DelayQueue(() => nowMs);
    queue.push("m-1", "now", 0);
    queue.push("m-2", "later", 10_000);
    const downstream: Downstream = { deliver: vi.fn().mockResolvedValue(undefined) };

    expect(await pump(queue, downstream)).toBe(true);
    expect(await pump(queue, downstream)).toBe(false);
    nowMs = 10_000;
    expect(await pump(queue, downstream)).toBe(true);
    expect(queue.depth).toBe(0);
    expect(downstream.deliver).toHaveBeenNthCalledWith(2, "later");
  });
});
