import { describe, expect, it } from "vitest";
import { Organisation } from "./impl";

describe("Organisation.changeRole", () => {
  it("promotes an editor to owner", () => {
    const org = new Organisation([
      { userId: "usr_1", role: "owner" },
      { userId: "usr_2", role: "editor" },
    ]);

    expect(org.changeRole("usr_2", "owner")).toEqual({ userId: "usr_2", role: "owner" });
    expect(org.roleOf("usr_2")).toBe("owner");
  });

  it("throws for a user who is not a member of the organisation", () => {
    const org = new Organisation([{ userId: "usr_1", role: "owner" }]);

    expect(() => org.changeRole("usr_nope", "viewer")).toThrow("usr_nope is not a member");
  });

  it("moves an editor down to viewer", () => {
    const org = new Organisation([
      { userId: "usr_1", role: "owner" },
      { userId: "usr_2", role: "editor" },
    ]);

    expect(org.changeRole("usr_2", "viewer").role).toBe("viewer");
  });
});
