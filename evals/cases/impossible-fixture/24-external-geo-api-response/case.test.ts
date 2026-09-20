import { describe, expect, it } from "vitest";
import { resolveTimezone } from "./impl";

describe("resolveTimezone", () => {
  it("uses the first result from the lookup and falls back to UTC when the lookup is degraded", async () => {
    const respondWith = (body: unknown) =>
      (async () => ({ ok: true, status: 200, json: async () => body })) as unknown as typeof fetch;

    await expect(
      resolveTimezone(
        "203.0.113.9",
        respondWith({ status: "ok", results: [{ country_code: "TH", timezone: "Asia/Bangkok" }] }),
      ),
    ).resolves.toBe("Asia/Bangkok");

    await expect(
      resolveTimezone("203.0.113.9", respondWith({ status: "rate_limited", results: [] })),
    ).resolves.toBe("UTC");
  });
});
