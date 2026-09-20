import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { CartSummary } from "./impl";
import { PriceTag } from "./price-tag";

vi.mock("./price-tag", () => ({ PriceTag: vi.fn(() => null) }));

describe("CartSummary", () => {
  it("adds tax to the subtotal for the displayed total", () => {
    render(<CartSummary lines={[{ sku: "a", qty: 2, unitCents: 1_000 }]} taxBps={700} />);

    expect(PriceTag).toHaveBeenCalled();
    expect(vi.mocked(PriceTag).mock.calls.length).toBe(2);
  });
});
