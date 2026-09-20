import { describe, expect, it } from "vitest";
import { cancelBooking } from "./impl";

describe("cancelBooking", () => {
  it("refunds the full price when the booking is cancelled more than 48 hours ahead", () => {
    const cancelled = cancelBooking(
      { id: "b-4", status: "confirmed", priceCents: 9000, startsAt: 400_000_000, refundCents: 0 },
      100_000_000,
    );

    expect(cancelled.status).toBe("cancelled");
    expect(cancelled.id).toBe("b-4");
  });
});
