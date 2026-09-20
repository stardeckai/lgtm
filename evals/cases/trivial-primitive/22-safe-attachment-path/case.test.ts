import path from "node:path";
import { describe, expect, it } from "vitest";
import { attachmentPath } from "./impl";

describe("attachmentPath", () => {
  it("refuses paths that climb out of the storage root", () => {
    const root = "/srv/uploads";

    expect(attachmentPath(root, "org_1/receipt.pdf")).toBe(path.join(root, "org_1/receipt.pdf"));
    expect(() => attachmentPath(root, "../etc/passwd")).toThrow("escapes the storage root");
    expect(() => attachmentPath(root, "org_1/../../etc/passwd")).toThrow("escapes the storage root");
    expect(() => attachmentPath(root, "/etc/passwd")).toThrow("escapes the storage root");
  });
});
