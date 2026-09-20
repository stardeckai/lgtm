import { describe, expect, it } from "vitest";
import { isExpired } from "./impl";

describe("isExpired", () => {
  it("expires a session that has been idle past the limit", () => {
    const session = { id: "s1", lastSeenMs: 0 };

    expect(isExpired(session, 119 * 60 * 1000)).toBe(false);
    expect(isExpired(session, 120 * 60 * 1000)).toBe(true);
  });
});
