import { describe, expect, test } from "vitest";
import { SeatMap, type Seat } from "./impl";

describe("SeatMap", () => {
  test("holds nothing at all when one seat in the request is already taken", () => {
    const seats: Seat[] = [
      { id: "A1", row: 1, number: 1, holderId: null },
      { id: "A2", row: 1, number: 2, holderId: "other_buyer" },
      { id: "A3", row: 1, number: 3, holderId: null },
    ];
    const map = new SeatMap(seats);

    expect(() => map.hold("buyer_1", ["A1", "A2", "A3"])).toThrow("seat A2 already held");
    expect(map.free()).toEqual(["A1", "A3"]);
  });
});
