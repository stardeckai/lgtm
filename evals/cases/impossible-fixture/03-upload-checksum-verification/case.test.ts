import { describe, expect, it } from "vitest";
import { UploadStore, verifyUpload } from "./impl";

describe("verifyUpload", () => {
  it("reports a scanned upload as ready when the checksum read back matches", () => {
    const store = new UploadStore();
    store.hydrate([{ key: "u/1.pdf", bytes: 0, checksum: "", scanned: true }]);

    expect(verifyUpload(store, "u/1.pdf", "")).toBe("ready");
  });
});
