import { describe, expect, it } from "vitest";
import { cacheControl } from "./impl";

describe("cacheControl", () => {
  it("adds no-store to a private resource", () => {
    expect(cacheControl({ public: false, maxAgeSeconds: 60, mutable: true })).toMatchInlineSnapshot(
      `"private, max-age=60, no-store"`,
    );
    expect(cacheControl({ public: true, maxAgeSeconds: 60, staleWhileRevalidateSeconds: 300, mutable: true })).toBe(
      "public, max-age=60, stale-while-revalidate=300",
    );
  });
});
