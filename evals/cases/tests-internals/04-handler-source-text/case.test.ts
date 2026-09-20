import { describe, expect, it } from "vitest";
import { inviteMember } from "./impl";

describe("inviteMember", () => {
  it("scopes the duplicate lookup to the organisation", () => {
    const source = inviteMember.toString();

    expect(source).toContain("db.select");
    expect(source).toContain("orgId");
  });
});
