import { describe, expect, it } from "vitest";
import { hashToken, verifyToken } from "./impl";

describe("api token hashing", () => {
  it("accepts the original token and refuses a near miss or a mangled record", () => {
    const stored = hashToken("tok_live_7f3a");

    expect(stored.startsWith("scrypt$")).toBe(true);
    expect(stored).not.toContain("tok_live_7f3a");
    expect(verifyToken("tok_live_7f3a", stored)).toBe(true);
    expect(verifyToken("tok_live_7f3b", stored)).toBe(false);
    expect(verifyToken("tok_live_7f3a", "plain$abc$def")).toBe(false);
  });
});
