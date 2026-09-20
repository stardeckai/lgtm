import { describe, expect, it, vi } from "vitest";
import { attemptSend, ProviderError, type SmsProvider } from "./impl";

describe("attemptSend", () => {
  it("marks an unsubscribed recipient as permanently failed and rethrows an unknown error", async () => {
    const provider: SmsProvider = {
      send: vi.fn().mockRejectedValue(new ProviderError("21610", 400)),
    };

    await expect(attemptSend(provider, "+15550100", "hi")).resolves.toEqual({
      delivered: false,
      retryable: false,
      failureCode: "21610",
    });

    const broken: SmsProvider = { send: vi.fn().mockRejectedValue(new TypeError("socket hang up")) };
    await expect(attemptSend(broken, "+15550100", "hi")).rejects.toThrow(TypeError);
  });
});
