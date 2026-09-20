import { describe, expect, it } from "vitest";
import { reserveSeats, SeatLimitError } from "./impl";

describe("reserveSeats", () => {
  it("refuses a reservation beyond the remaining licensed seats", () => {
    expect(() => reserveSeats({ orgId: "org_42", requested: 4, licensed: 25, used: 23 })).toThrow(
      new SeatLimitError("org_42", 2),
    );
    expect(() => reserveSeats({ orgId: "org_42", requested: 2, licensed: 25, used: 23 })).not.toThrow();
    expect(reserveSeats({ orgId: "org_42", requested: 2, licensed: 25, used: 23 })).toBe(25);
  });
});
