import { describe, expect, it } from "vitest";
import { withRetries } from "./impl";

const noSleep = async () => {};

describe("withRetries", () => {
  it("returns the value the operation produced", async () => {
    const result = await withRetries(async () => "shipped", 3, noSleep);

    expect(result).toEqual({ ok: true, value: "shipped" });
  });

  it("passes through a falsy value unchanged", async () => {
    expect(await withRetries(async () => 0, 3, noSleep)).toEqual({ ok: true, value: 0 });
  });

  it("works with a single permitted attempt", async () => {
    expect(await withRetries(async () => "ok", 1, noSleep)).toEqual({ ok: true, value: "ok" });
  });
});
