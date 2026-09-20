import { describe, expect, it } from "vitest";
import { addBusinessDays } from "./impl";

describe("addBusinessDays", () => {
  it("skips a holiday that falls on the last working day", () => {
    const result = addBusinessDays("2024-12-20T00:00:00.000Z", 3, ["2024-12-25", "2024-12-26"]);

    expect(result).toMatchInlineSnapshot(`"2024-12-27T00:00:00.000Z"`);
  });
});
