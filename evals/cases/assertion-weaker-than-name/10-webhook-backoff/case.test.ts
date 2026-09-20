import { describe, expect, it } from "vitest";
import { deliver } from "./impl";

describe("deliver", () => {
  it("retries a failing webhook with an exponentially growing delay until it succeeds", async () => {
    const log = await deliver(
      async (attempt) => attempt === 3,
      async () => undefined,
      5,
    );

    expect(log).toHaveLength(3);
    expect(log[2]?.ok).toBe(true);
  });
});
