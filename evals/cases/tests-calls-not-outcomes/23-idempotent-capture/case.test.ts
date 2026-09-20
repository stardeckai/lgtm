import { describe, expect, it, vi } from "vitest";
import { CaptureLedger, captureOnce, type Psp } from "./impl";

describe("captureOnce", () => {
  it("returns the first capture id and does not charge again for a replayed key", async () => {
    const psp: Psp = { capture: vi.fn().mockResolvedValue({ id: "cap_1" }) };
    const ledger = new CaptureLedger();

    const first = await captureOnce(psp, ledger, "key-a", "pi_1", 2_500);
    const second = await captureOnce(psp, ledger, "key-a", "pi_1", 2_500);

    expect(first).toBe("cap_1");
    expect(second).toBe("cap_1");
    expect(psp.capture).toHaveBeenCalledTimes(1);
    expect(psp.capture).toHaveBeenCalledWith("pi_1", 2_500);
  });
});
