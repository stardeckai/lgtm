import { describe, expect, it } from "vitest";
import { ConflictError, VersionedStore } from "./impl";

describe("VersionedStore", () => {
  it("rejects a stale write and leaves the stored body untouched", () => {
    const store = new VersionedStore();
    store.seed({ id: "doc_1", version: 4, body: "current text" });

    expect.assertions(4);
    try {
      store.update("doc_1", 2, "overwritten text");
    } catch (err) {
      if (!(err instanceof ConflictError)) throw err;
      expect(err.currentVersion).toBe(4);
      expect(err.attemptedVersion).toBe(2);
    }

    expect(store.read("doc_1")?.body).toBe("current text");
    expect(store.read("doc_1")?.version).toBe(4);
  });
});
