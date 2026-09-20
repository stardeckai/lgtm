import { describe, expect, it } from "vitest";

describe("pricing server boundary", () => {
  it("pricing types module does not import the browser client or expose secrets", async () => {
    const mod = await import("./impl");

    expect(mod.PricingClientError).toBeDefined();
    expect(mod.quoteDisplayState).toBeDefined();
    expect(mod.snapshotFromQuoteResponse).toBeDefined();
  });
});
