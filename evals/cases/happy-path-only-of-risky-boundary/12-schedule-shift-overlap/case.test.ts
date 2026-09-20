import { describe, expect, it } from "vitest";
import { Roster } from "./impl";

describe("Roster.assign", () => {
  it("adds the shift to the staff member's hours for the day", () => {
    const roster = new Roster();

    roster.assign({ staffId: "stf_2", startMinute: 540, endMinute: 780 });

    expect(roster.hoursFor("stf_2")).toBe(4);
  });

  it("rejects a shift that ends before it starts", () => {
    const roster = new Roster();

    expect(() => roster.assign({ staffId: "stf_2", startMinute: 600, endMinute: 540 })).toThrow();
  });

  it("adds a second shift later in the day", () => {
    const roster = new Roster();
    roster.assign({ staffId: "stf_2", startMinute: 540, endMinute: 660 });

    roster.assign({ staffId: "stf_2", startMinute: 780, endMinute: 900 });

    expect(roster.hoursFor("stf_2")).toBe(4);
  });
});
