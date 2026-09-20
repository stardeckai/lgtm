import { describe, expect, it } from "vitest";
import { Outbox, relay } from "./impl";

describe("relay", () => {
  it("publishes each appended row once, in order, and leaves nothing unsent", () => {
    const outbox = new Outbox();
    outbox.append("order.placed", '{"id":"o1"}');
    outbox.append("order.paid", '{"id":"o1"}');
    const published: Array<[string, string]> = [];

    const first = relay(outbox, (topic, payload) => published.push([topic, payload]), 1000);
    const second = relay(outbox, (topic, payload) => published.push([topic, payload]), 2000);

    expect(first).toBe(2);
    expect(second).toBe(0);
    expect(published).toEqual([
      ["order.placed", '{"id":"o1"}'],
      ["order.paid", '{"id":"o1"}'],
    ]);
    expect(outbox.unsent()).toEqual([]);
  });
});
