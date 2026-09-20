import { describe, expect, it } from "vitest";
import { lateFeeCents, type Rental } from "./impl";

describe("lateFeeCents", () => {
  it("doubles the daily rate after the first week", () => {
    const rental: Rental = {
      id: "r-31",
      dueOn: "2024-05-01T00:00:00.000Z",
      returnedOn: "2024-05-12T00:00:00.000Z",
      dailyFeeCents: 150,
    };

    const lateDays = Math.floor(
      (Date.parse(rental.returnedOn) - Date.parse(rental.dueOn)) / (24 * 60 * 60 * 1000),
    );
    let expected = 0;
    for (let day = 1; day <= lateDays; day += 1) {
      expected += day > 7 ? rental.dailyFeeCents * 2 : rental.dailyFeeCents;
    }

    expect(lateFeeCents(rental)).toBe(Math.min(expected, 4000));
  });
});
