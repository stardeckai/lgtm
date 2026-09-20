import { describe, expect, it } from "vitest";
import { expandRecurrence } from "./impl";

describe("expandRecurrence", () => {
  it("lands on the requested weekdays and jumps over a blocked date", () => {
    expect(
      expandRecurrence({
        weekdays: [1, 3],
        startIso: "2024-01-01T00:00:00.000Z",
        count: 4,
        skipIso: ["2024-01-08"],
      }),
    ).toEqual(["2024-01-01", "2024-01-03", "2024-01-10", "2024-01-15"]);
  });
});
