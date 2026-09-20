import { describe, expect, it } from "vitest";
import { Queue } from "./impl";

describe("Queue", () => {
  it("hands the consumer exactly what the producer enqueued and drops the repeat", () => {
    const queue = new Queue();

    expect(queue.enqueue({ kind: "email", to: "ops@example.com", attempt: 1 })).toBe(true);
    expect(queue.enqueue({ kind: "email", to: "ops@example.com", attempt: 1 })).toBe(false);
    expect(queue.enqueue({ kind: "sms", to: "+15550000", attempt: 2 })).toBe(true);

    expect(queue.drain()).toEqual([
      { kind: "email", to: "ops@example.com", attempt: 1 },
      { kind: "sms", to: "+15550000", attempt: 2 },
    ]);
    expect(queue.drain()).toEqual([]);
  });
});
