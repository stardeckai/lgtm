import { describe, expect, it } from "vitest";
import { SeatService } from "./impl";

describe("SeatService.claim", () => {
  it("adds the seat and bumps the version", () => {
    const seats = new SeatService({ eventId: "evt_1", taken: ["A1"], version: 4 });

    expect(seats.claim("B2", 4)).toEqual({ eventId: "evt_1", taken: ["A1", "B2"], version: 5 });
  });

  it("rejects a claim built on a version another buyer has already moved past", () => {
    const seats = new SeatService({ eventId: "evt_1", taken: ["A1"], version: 4 });
    seats.claim("B2", 4);

    expect(() => seats.claim("B3", 4)).toThrow("seat map changed, reload and retry");
    expect(seats.current().taken).toEqual(["A1", "B2"]);
  });
});
