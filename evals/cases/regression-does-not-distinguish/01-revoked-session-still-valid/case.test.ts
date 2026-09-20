import { describe, expect, it } from "vitest";
import { isSessionValid, type Session } from "./impl";

describe("isSessionValid", () => {
  it("rejects a revoked session that has not expired yet", () => {
    const session: Session = { userId: "u-7", expiresAt: 2000, revoked: true };

    expect(isSessionValid(session, 1000)).toBe(false);
    expect(isSessionValid({ ...session, revoked: false }, 1000)).toBe(true);
  });
});
