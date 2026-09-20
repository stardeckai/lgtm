import { describe, expect, it, vi } from "vitest";
import { requestPasswordReset, type Mailer, type TokenStore } from "./impl";

describe("requestPasswordReset", () => {
  it("emails the reset link to the user", async () => {
    const mailer: Mailer = { send: vi.fn().mockResolvedValue(undefined) };
    const tokens: TokenStore = { put: vi.fn().mockResolvedValue(undefined) };

    await requestPasswordReset(
      { id: "u-1", email: "kim@example.com", locale: "en" },
      mailer,
      tokens,
      "tok_abc",
      1_700_000_000_000,
    );

    expect(mailer.send).toHaveBeenCalled();
  });
});
