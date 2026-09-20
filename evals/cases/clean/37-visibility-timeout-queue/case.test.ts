import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VisibilityQueue } from "./impl";

describe("VisibilityQueue", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("hides a received message until its timeout and lets it be redelivered after", () => {
    vi.setSystemTime(new Date("2026-05-05T00:00:00Z"));
    const queue = new VisibilityQueue(30_000, 2);
    queue.send("m1", "resize image");

    expect(queue.receive(Date.now())).toEqual({ id: "m1", body: "resize image", receipts: 1 });
    vi.advanceTimersByTime(29_000);
    expect(queue.receive(Date.now())).toBeNull();

    vi.advanceTimersByTime(1_000);
    expect(queue.receive(Date.now())).toEqual({ id: "m1", body: "resize image", receipts: 2 });
    expect(queue.deadLetters()).toEqual([]);

    vi.advanceTimersByTime(30_000);
    expect(queue.receive(Date.now())?.receipts).toBe(3);
    expect(queue.deadLetters()).toEqual([{ id: "m1", body: "resize image", receipts: 3 }]);

    queue.delete("m1");
    expect(queue.receive(Date.now() + 60_000)).toBeNull();
  });
});
