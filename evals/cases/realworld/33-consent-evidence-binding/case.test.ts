import { describe, expect, it, vi } from "vitest";
import { bookWithConsent, type BookingEngine, type ConsentStore } from "./impl";

const BOOKING_ID = "bk-0001";
const REQUEST_ID = "req-0001";

describe("consent evidence contract", () => {
  it("binds verified consent evidence to the resulting booking", async () => {
    const store: ConsentStore = {
      verify: vi.fn().mockResolvedValue(true),
      bind: vi.fn().mockResolvedValue(undefined),
    };
    const engine: BookingEngine = {
      createBooking: vi.fn().mockResolvedValue({ bookingId: BOOKING_ID }),
      cancelBooking: vi.fn(),
    };

    const result = await bookWithConsent(store, engine, {
      quoteToken: "qt-0001",
      consentRequestId: REQUEST_ID,
    });

    expect(result.status).toBe(200);
    expect(store.verify).toHaveBeenCalledWith(REQUEST_ID);
    expect(store.bind).toHaveBeenCalledWith({ requestId: REQUEST_ID, bookingId: BOOKING_ID });
  });
});
