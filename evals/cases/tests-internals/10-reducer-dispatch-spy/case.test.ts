import { describe, expect, it, vi } from "vitest";
import { holdSeats, type SeatAction } from "./impl";

describe("holdSeats", () => {
  it("holds at most four seats for one booking", () => {
    const dispatch = vi.fn<[SeatAction], void>();

    holdSeats(dispatch, ["A1", "A2", "A3", "A4", "A5"]);

    expect(dispatch.mock.calls.map(([action]) => action.type)).toEqual([
      "clear",
      "hold",
      "hold",
      "hold",
      "hold",
      "hold",
    ]);
  });
});
