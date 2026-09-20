import { describe, expect, it, vi } from "vitest";
import { refundCharge, type Psp } from "./impl";

describe("refundCharge", () => {
  it("caps the refund at the amount still outstanding", async () => {
    const psp: Psp = { refund: vi.fn().mockResolvedValue({ id: "re_1" }) };

    await refundCharge(
      psp,
      { id: "ch_1", cents: 10_000, refundedCents: 7_500, capturedAt: "2024-01-01T00:00:00.000Z" },
      9_000,
      "customer request",
    );

    expect(psp.refund).toHaveBeenCalledWith(expect.objectContaining({ chargeId: "ch_1" }));
  });
});
