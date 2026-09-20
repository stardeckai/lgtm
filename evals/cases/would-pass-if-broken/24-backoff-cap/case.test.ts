import { describe, expect, it } from "vitest";
import { delaysFor } from "./impl";

describe("delaysFor", () => {
  it("grows the delay by the factor and then holds it at the cap", () => {
    expect(delaysFor({ baseMs: 1000, factor: 2, maxMs: 8000, maxAttempts: 6 })).toEqual([
      1000, 2000, 4000, 8000, 8000, 8000,
    ]);
  });
});
