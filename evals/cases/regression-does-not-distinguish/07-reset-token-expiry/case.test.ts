import { describe, expect, it } from "vitest";
import { ResetTokens } from "./impl";

describe("ResetTokens", () => {
  it("refuses a reset token once it has aged out", () => {
    const tokens = new ResetTokens();
    tokens.issue("u-4", "tok-abc", 1_000_000);

    expect(tokens.redeem("tok-abc", 1_060_000)).toBe("u-4");
    expect(tokens.redeem("tok-abc", 1_120_000)).toBeNull();
  });
});
