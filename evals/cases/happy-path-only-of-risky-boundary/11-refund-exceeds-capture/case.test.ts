import { describe, expect, it } from "vitest";
import { ChargeBook } from "./impl";

function book(): ChargeBook {
  const instance = new ChargeBook();
  instance.add({ id: "ch_7", capturedCents: 10_000, refundedCents: 0 });
  return instance;
}

describe("ChargeBook.refund", () => {
  it("records a partial refund against the charge", () => {
    expect(book().refund("ch_7", 2_500)).toEqual({
      id: "ch_7",
      capturedCents: 10_000,
      refundedCents: 2_500,
    });
  });

  it("throws for a charge id that was never captured", () => {
    expect(() => book().refund("ch_missing", 100)).toThrow("unknown charge ch_missing");
  });

  it("accumulates two partial refunds on the same charge", () => {
    const charges = book();
    charges.refund("ch_7", 1_000);

    expect(charges.refund("ch_7", 2_000).refundedCents).toBe(3_000);
  });
});
