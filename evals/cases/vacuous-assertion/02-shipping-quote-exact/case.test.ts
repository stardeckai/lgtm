import { describe, expect, it } from "vitest";
import { quoteShipping } from "./impl";

describe("quoteShipping", () => {
  it("charges 120 cents for every extra half kilo on ground shipping", () => {
    const quote = quoteShipping(2000, false);

    expect(quote).toBeDefined();
    expect(quote.carrier).toBe("ground");
    expect(quote.cents).toBe(839);
    expect(quote.etaDays).toBe(4);
  });
});
