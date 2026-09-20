import { describe, expect, it } from "vitest";
import { partySummary, type BookingRow } from "./impl";

describe("party summary", () => {
  it("shows a known group count when historical attendee names are unavailable", () => {
    const booking = { partySize: 3 } as BookingRow;

    expect(partySummary(booking)).toBe("3 guests — open booking for attendee details");
  });
});
