import { describe, expect, it, vi } from "vitest";
import { FlagResolver } from "./impl";

describe("FlagResolver", () => {
  it("logs the network reason and keeps defaults, but lets a malformed payload through as an error", async () => {
    const logger = { warn: vi.fn() };
    const defaults = { newCheckout: false, betaSearch: true };
    const offline = new FlagResolver({ load: vi.fn().mockRejectedValue(new Error("ENOTFOUND flags.example")) }, logger, defaults);

    await expect(offline.resolve()).resolves.toEqual({ newCheckout: false, betaSearch: true });
    expect(logger.warn).toHaveBeenCalledWith("flag source unreachable, using defaults", {
      reason: "ENOTFOUND flags.example",
    });

    const malformed = new FlagResolver({ load: vi.fn().mockResolvedValue(null as unknown as Record<string, boolean>) }, logger, defaults);
    await expect(malformed.resolve()).rejects.toThrow(TypeError);
  });
});
