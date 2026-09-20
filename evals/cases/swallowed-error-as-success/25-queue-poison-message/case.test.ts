import { describe, expect, it } from "vitest";
import { Consumer } from "./impl";

describe("Consumer", () => {
  it("rethrows for a retryable failure and only dead-letters on the final attempt", () => {
    const consumer = new Consumer(3);
    const explode = () => {
      throw new Error("handler blew up");
    };

    expect(() => consumer.handle({ id: "m_1", body: "{}", attempts: 0 }, explode)).toThrow("handler blew up");
    expect(consumer.deadLetters).toEqual([]);

    consumer.handle({ id: "m_1", body: "{}", attempts: 2 }, explode);

    expect(consumer.deadLetters).toEqual([{ id: "m_1", body: "{}", attempts: 3 }]);
    expect(consumer.processed).toEqual([]);
  });
});
