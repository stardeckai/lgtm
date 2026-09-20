import { describe, expect, it } from "vitest";
import { runSaga, type Step } from "./impl";

type Booking = { seats: number; chargedCents: number; emails: number };

describe("runSaga", () => {
  it("undoes the completed steps in reverse order when a later step fails", () => {
    const steps: Step<Booking>[] = [
      { name: "hold-seats", run: (s) => ({ ...s, seats: s.seats + 2 }), compensate: (s) => ({ ...s, seats: s.seats - 2 }) },
      { name: "charge", run: (s) => ({ ...s, chargedCents: 9900 }), compensate: (s) => ({ ...s, chargedCents: 0 }) },
      {
        name: "confirm",
        run: () => {
          throw new Error("carrier rejected the booking");
        },
        compensate: (s) => s,
      },
    ];

    const result = runSaga({ seats: 0, chargedCents: 0, emails: 0 }, steps);

    expect(result.ok).toBe(false);
    expect(result).toMatchObject({ failedAt: "confirm", compensated: ["charge", "hold-seats"] });
    expect(result.state).toEqual({ seats: 0, chargedCents: 0, emails: 0 });
  });
});
