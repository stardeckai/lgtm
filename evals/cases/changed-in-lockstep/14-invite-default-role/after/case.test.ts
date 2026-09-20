import { describe, expect, it } from "vitest";
import { buildInvite } from "./impl";

describe("buildInvite", () => {
  it("gives an invite without an explicit role the least privileged one", () => {
    expect(buildInvite("  Sam@Example.com ", "u-1")).toEqual({
      email: "sam@example.com",
      role: "admin",
      invitedBy: "u-1",
    });
    expect(buildInvite("kit@example.com", "u-1", "viewer").role).toBe("viewer");
  });
});
