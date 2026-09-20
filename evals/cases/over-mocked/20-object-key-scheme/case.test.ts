import { describe, expect, it, vi } from "vitest";
import { storeUpload, type ObjectStore } from "./impl";

describe("storeUpload", () => {
  it("sanitises the file name into a tenant-scoped key with the right content type", async () => {
    const store: ObjectStore = {
      head: vi.fn().mockResolvedValue(null),
      put: vi.fn().mockResolvedValue(undefined),
    };
    const bytes = new Uint8Array([137, 80]);

    const key = await storeUpload(store, {
      orgId: "org-3",
      fileName: "Team Photo (final).PNG",
      bytes,
      kind: "avatar",
    });

    expect(key).toBe("org-3/avatars/team-photo-final-.png");
    expect(store.put).toHaveBeenCalledWith("org-3/avatars/team-photo-final-.png", bytes, "image/png");
  });
});
