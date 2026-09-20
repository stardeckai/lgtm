import { describe, expect, it } from "vitest";
import { ObjectStore, type ObjectRef } from "./impl";

describe("ObjectStore", () => {
  it("refuses a traversing id and will not serve one org's key to another", () => {
    const store = new ObjectStore();
    const ref: ObjectRef = { orgId: "acme", kind: "export", id: "march", ext: "csv" };

    const key = store.put(ref, Buffer.from("id,total\n"));

    expect(key).toBe("orgs/acme/export/march.csv");
    expect(store.get("acme", key)?.toString()).toBe("id,total\n");
    expect(store.get("globex", key)).toBeNull();
    expect(() => store.put({ ...ref, id: "../globex/export/march" }, Buffer.from("x"))).toThrow(/unsafe object id/);
  });
});
