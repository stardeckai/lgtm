import { describe, expect, it } from "vitest";
import { nextDueOn } from "./impl";

describe("nextDueOn", () => {
  it("counts the booster interval forward in whole days across a year and a new year", () => {
    expect(
      nextDueOn({ name: "rabies", givenOn: "2026-02-20", intervalDays: 365 }),
    ).toBe("2027-02-20");
    expect(
      nextDueOn({
        name: "kennel cough",
        givenOn: "2026-12-25",
        intervalDays: 21,
      }),
    ).toBe("2027-01-15");
  });
});
