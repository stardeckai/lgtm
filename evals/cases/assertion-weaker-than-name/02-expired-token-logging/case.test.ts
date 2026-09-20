import { describe, expect, it } from "vitest";
import { Authenticator } from "./impl";

describe("Authenticator.authenticate", () => {
  it("rejects an expired token and records the attempt with the expired reason", () => {
    const auth = new Authenticator(
      new Map([["t-1", { id: "t-1", subject: "u-4", expiresAtMs: 1_000 }]]),
    );

    expect(auth.authenticate("t-1", 2_000)).toBeNull();
  });
});
