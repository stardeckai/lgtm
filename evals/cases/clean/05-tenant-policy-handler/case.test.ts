import { describe, expect, it } from "vitest";
import { readRecord, RecordStore, type Principal } from "./impl";

describe("readRecord", () => {
  it("hides another organisation's record behind a 404 and its own org's behind a 403", () => {
    const store = new RecordStore([
      { id: "r1", orgId: "org_a", ownerId: "u1", body: "alpha" },
      { id: "r2", orgId: "org_b", ownerId: "u9", body: "beta" },
    ]);
    const member: Principal = { userId: "u2", orgId: "org_a", role: "member" };

    expect(readRecord(store, { userId: "u1", orgId: "org_a", role: "member" }, "r1")).toEqual({
      status: 200,
      body: "alpha",
    });
    expect(readRecord(store, member, "r1")).toEqual({ status: 403 });
    expect(readRecord(store, member, "r2")).toEqual({ status: 404 });
    expect(readRecord(store, { userId: "u3", orgId: "org_a", role: "owner" }, "r1")).toEqual({
      status: 200,
      body: "alpha",
    });
  });
});
