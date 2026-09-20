import { describe, expect, it } from "vitest";
import { AccessStore } from "./impl";

describe("AccessStore", () => {
  it("withdraws only the group's access when a member leaves and keeps their direct grant", () => {
    const store = new AccessStore();
    store.addToGroup("finance", "u1");
    store.addToGroup("finance", "u2");
    store.grantToGroup("finance", "ledger", "read");
    store.grantDirect("u1", "ledger", "write");

    expect(store.can("u1", "ledger", "read")).toBe(true);
    expect(store.can("u2", "ledger", "read")).toBe(true);

    store.removeFromGroup("finance", "u1");

    expect(store.can("u1", "ledger", "read")).toBe(false);
    expect(store.can("u1", "ledger", "write")).toBe(true);
    expect(store.can("u2", "ledger", "read")).toBe(true);
  });
});
