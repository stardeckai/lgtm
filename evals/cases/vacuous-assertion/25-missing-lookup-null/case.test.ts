import { describe, expect, it } from "vitest";
import { KeyDirectory } from "./impl";

describe("KeyDirectory.resolve", () => {
  it("stops resolving a key from the moment it is revoked", () => {
    const directory = new KeyDirectory();
    directory.add({ hash: "h1", orgId: "org-1", revokedAtMs: 5_000 });

    expect(directory.resolve("h1", 4_999)?.orgId).toBe("org-1");
    expect(directory.resolve("h1", 5_000)).toBeNull();
    expect(directory.resolve("unknown", 0)).toBeNull();
  });
});
