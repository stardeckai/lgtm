import { describe, expect, it } from "vitest";
import { issue } from "./impl";

const clock = () => new Date("2024-02-08T14:25:00.000Z");

describe("issue", () => {
  it("puts end-of-month terms on the last day of the issuing month", () => {
    expect(issue("inv_1", "eom", clock, 5)).toEqual({
      id: "inv_1",
      issuedAtIso: "2024-02-08T14:25:00.000Z",
      dueIso: "2024-02-29",
      graceEndsIso: "2024-03-05",
    });
  });
});
