import { describe, expect, it } from "vitest";
import { ROLE_PERMISSIONS } from "./impl";

describe("permissions", () => {
  it("keeps billing an owner-only permission", () => {
    expect(Object.keys(ROLE_PERMISSIONS)).toEqual(["viewer", "editor", "admin", "owner"]);
    expect(ROLE_PERMISSIONS.owner).toHaveLength(4);
  });
});
