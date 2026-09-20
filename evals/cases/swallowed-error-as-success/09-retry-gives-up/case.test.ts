import { describe, expect, it, vi } from "vitest";
import { withRetries } from "./impl";

describe("withRetries", () => {
  it("gives up and returns the fallback after three attempts", async () => {
    const attempt = vi.fn().mockRejectedValue(new Error("upstream 503"));

    const result = await withRetries(attempt, 3, { status: "unknown" });

    expect(result).toEqual({ status: "unknown" });
  });
});
