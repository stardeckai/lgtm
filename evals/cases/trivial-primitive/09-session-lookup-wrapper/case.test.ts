import { describe, expect, it } from "vitest";
import { SessionCache } from "./impl";

describe("SessionCache.find", () => {
  it("returns the stored session and null for an id that was never set", () => {
    const cache = new SessionCache();
    const session = { id: "ses_1", userId: "usr_1", expiresAtMs: 5_000 };
    cache.set(session);

    expect(cache.find("ses_1")).toEqual(session);
    expect(cache.find("ses_2")).toBeNull();
  });
});
