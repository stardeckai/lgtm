import { describe, expect, it } from "vitest";
import { authenticate, TokenExpiredError } from "./impl";

describe("authenticate", () => {
  it("refuses a token whose ttl has already elapsed", () => {
    const token = { subject: "u-42", issuedAt: 1_000, ttlSeconds: 60 };

    expect(authenticate(token, 1_059)).toBe("u-42");
    expect(() => authenticate(token, 1_060)).toThrow(TokenExpiredError);
    expect(() => authenticate(token, 1_060)).toThrow("token expired at 1060");
  });
});
