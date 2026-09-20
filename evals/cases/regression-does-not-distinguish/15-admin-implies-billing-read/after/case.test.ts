import { describe, expect, it } from "vitest";
import { can, type Member } from "./impl";

describe("can", () => {
  it("lets an admin read billing", () => {
    const admin: Member = { userId: "u-1", role: "admin", grants: ["billing:read"] };
    const member: Member = { userId: "u-2", role: "member", grants: [] };

    expect(can(admin, "billing:read")).toBe(true);
    expect(can(member, "billing:read")).toBe(false);
    expect(can(admin, "billing:write")).toBe(false);
  });
});
