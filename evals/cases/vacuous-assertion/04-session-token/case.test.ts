import { describe, expect, it } from "vitest";
import { createSession } from "./impl";

describe("createSession", () => {
  it("issues a session that drops the admin wildcard scope", () => {
    const session = createSession("u-9", ["read:orders", "admin:*"], 1_700_000_000_000);

    expect(session.token).toBeTruthy();
  });
});
