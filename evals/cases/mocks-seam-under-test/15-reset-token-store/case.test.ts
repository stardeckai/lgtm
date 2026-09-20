import { describe, expect, it, vi } from "vitest";
import { consumeResetToken, type Hasher, type TokenStore } from "./impl";

const hasher: Hasher = { hash: vi.fn((raw: string) => `h:${raw}`) };

describe("consumeResetToken", () => {
  it("refuses a token that has already been redeemed", async () => {
    const store: TokenStore = {
      find: vi.fn().mockResolvedValue({
        hash: "h:tok_a",
        userId: "u_1",
        expiresAt: 2_000_000_000_000,
        usedAt: 1_700_000_000_000,
      }),
      markUsed: vi.fn().mockResolvedValue(true),
    };

    await expect(consumeResetToken(store, hasher, "tok_a", 1_700_000_100_000)).rejects.toThrow(
      "token already used",
    );
  });
});
