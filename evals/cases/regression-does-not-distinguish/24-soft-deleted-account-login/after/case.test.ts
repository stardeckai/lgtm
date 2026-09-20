import { describe, expect, it } from "vitest";
import { Accounts } from "./impl";

describe("Accounts", () => {
  it("refuses a closed account even with the right password", () => {
    const accounts = new Accounts();
    accounts.add({ email: "Dana@example.com", passwordHash: "h1", deletedAt: null });
    accounts.add({ email: "gone@example.com", passwordHash: "h2", deletedAt: 1_700_000_000 });

    expect(accounts.authenticate("dana@example.com", "h1")?.email).toBe("Dana@example.com");
    expect(accounts.authenticate("gone@example.com", "h2")).toBeNull();
  });
});
