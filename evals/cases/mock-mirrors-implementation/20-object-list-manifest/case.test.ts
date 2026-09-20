import { describe, expect, it, vi } from "vitest";
import { buildManifest, type ObjectStore } from "./impl";

const store: ObjectStore = {
  list: vi.fn().mockResolvedValue([
    { key: "exports/2024-05/a.csv", size: 2048, etag: "aa" },
    { key: "exports/2024-05/b.csv", size: 9001, etag: "bb" },
    { key: "exports/2024-05/c.csv.part", size: 512, etag: "cc" },
  ]),
};

describe("buildManifest", () => {
  it("excludes half-written parts from the totals and lists them separately", async () => {
    await expect(buildManifest(store, "exports/2024-05")).resolves.toEqual({
      prefix: "exports/2024-05",
      fileCount: 2,
      totalBytes: 11049,
      largestKey: "exports/2024-05/b.csv",
      partials: ["exports/2024-05/c.csv.part"],
    });
  });
});
