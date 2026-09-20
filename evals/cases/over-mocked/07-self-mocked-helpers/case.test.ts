import { describe, expect, it, vi } from "vitest";
import { publishRelease } from "./impl";

vi.mock("./version", () => ({ bumpVersion: vi.fn().mockReturnValue("2.4.0") }));
vi.mock("./manifest", () => ({
  buildManifest: vi.fn().mockReturnValue({ entries: [{ path: "a.js" }, { path: "b.js" }] }),
}));
vi.mock("./upload", () => ({ uploadBundle: vi.fn().mockResolvedValue(undefined) }));

describe("publishRelease", () => {
  it("publishes a minor release for a large changeset", async () => {
    const result = await publishRelease({
      appId: "app-1",
      files: Array.from({ length: 40 }, (_, i) => `f${i}.js`),
      previousVersion: "2.3.7",
    });

    expect(result).toEqual({ version: "2.4.0", manifestSize: 2 });
  });
});
