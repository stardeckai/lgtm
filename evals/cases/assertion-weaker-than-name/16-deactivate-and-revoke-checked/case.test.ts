import { describe, expect, it } from "vitest";
import { Org } from "./impl";

describe("Org.suspend", () => {
  it("marks the member inactive and revokes their live sessions without touching anyone else's", () => {
    const org = new Org(
      [
        { id: "m-1", active: true },
        { id: "m-2", active: true },
      ],
      [
        { id: "s-1", memberId: "m-1", revokedAtMs: null },
        { id: "s-2", memberId: "m-2", revokedAtMs: null },
      ],
    );

    org.suspend("m-1", 9_000);

    expect(org.members.map((m) => m.active)).toEqual([false, true]);
    expect(org.sessions.map((s) => s.revokedAtMs)).toEqual([9_000, null]);
  });
});
