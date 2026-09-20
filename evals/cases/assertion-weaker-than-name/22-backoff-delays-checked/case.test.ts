import { describe, expect, it } from "vitest";
import { deliver } from "./impl";

describe("deliver", () => {
  it("waits 0, 1000 then 2000 milliseconds before the attempt that finally succeeds", async () => {
    const slept: number[] = [];

    const log = await deliver(
      async (attempt) => attempt === 3,
      async (ms) => {
        slept.push(ms);
      },
      5,
    );

    expect(slept).toEqual([1000, 2000]);
    expect(log).toEqual([
      { number: 1, waitedMs: 0, ok: false },
      { number: 2, waitedMs: 1000, ok: false },
      { number: 3, waitedMs: 2000, ok: true },
    ]);
  });
});
