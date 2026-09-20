import { describe, expect, it, vi } from "vitest";
import { quote } from "./impl";

vi.mock("./discount-rules", () => ({ discountBpsFor: vi.fn().mockReturnValue(1_000) }));
vi.mock("./tax-rules", () => ({ taxBpsFor: vi.fn().mockReturnValue(700) }));
vi.mock("./shipping-rules", () => ({ shippingCentsFor: vi.fn().mockReturnValue(5_000) }));

describe("quote", () => {
  it("gives a gold customer their tier discount before tax", () => {
    const result = quote({ customerTier: "gold", subtotalCents: 100_000, country: "TH", weightGrams: 800 });

    expect(result).toEqual({ total: 101_300, discount: 10_000, tax: 6_300, shipping: 5_000 });
  });
});
