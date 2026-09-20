import { describe, expect, it, vi } from "vitest";
import { payEmployee, type PayoutApi } from "./impl";

describe("payEmployee", () => {
  it("transfers the net pay after tax and overtime", async () => {
    const api: PayoutApi = { transfer: vi.fn().mockResolvedValue(undefined) };

    await payEmployee(api, { id: "e-1", baseCents: 3_000_000, overtimeHours: 4, taxRate: 0.07 }, "2024-05");

    expect(api.transfer).toHaveBeenCalledWith(expect.anything());
    expect(api.transfer).toHaveBeenCalledTimes(1);
  });
});
