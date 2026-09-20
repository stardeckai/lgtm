import { describe, expect, test, vi } from "vitest";
import { convertCents, UpstreamUnavailable } from "./impl";

describe("convertCents", () => {
  test("falls back to the last known rate, but only when one exists", async () => {
    const source = { latest: vi.fn().mockRejectedValue(new Error("ETIMEDOUT")) };

    await expect(convertCents(source, "GBPUSD", 10_000, 1.27)).resolves.toEqual({
      cents: 12_700,
      rate: 1.27,
      stale: true,
    });
    await expect(convertCents(source, "GBPUSD", 10_000, null)).rejects.toBeInstanceOf(UpstreamUnavailable);
    await expect(convertCents(source, "GBPUSD", 10.5 as number, 1.27)).rejects.toThrow(TypeError);
  });
});
