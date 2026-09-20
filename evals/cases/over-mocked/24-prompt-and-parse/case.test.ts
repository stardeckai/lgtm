import { describe, expect, it, vi } from "vitest";
import { scanReceipt, type Model } from "./impl";

describe("scanReceipt", () => {
  it("rejects an extraction whose line items do not add up to the stated total", async () => {
    const model: Model = {
      complete: vi.fn().mockResolvedValue(
        'Sure!\n{"vendor":" Makro ","total_cents":1500,"lines":[{"label":" Rice ","cents":900},{"label":"Oil","cents":400}]}',
      ),
    };

    await expect(scanReceipt(model, "MAKRO\nRice 9.00\nOil 4.00")).rejects.toThrow(
      "line items 1300 do not add up to total 1500",
    );
    expect(vi.mocked(model.complete).mock.calls[0]![0]).toContain("MAKRO\nRice 9.00\nOil 4.00");
  });
});
