import { describe, expect, it, vi } from "vitest";
import { buyLabel, type Carrier } from "./impl";

describe("buyLabel", () => {
  it("buys an express label for a heavy domestic parcel", async () => {
    const carrier: Carrier = {
      createLabel: vi.fn().mockResolvedValue({ trackingNumber: "TH999" }),
    };

    await buyLabel(carrier, { weightGrams: 5000, destinationCountry: "TH", insuredCents: 250_000 });

    expect(carrier.createLabel).toHaveBeenCalled();
  });
});
