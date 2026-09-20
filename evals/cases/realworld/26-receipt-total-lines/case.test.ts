import { describe, expect, it } from "vitest";
import { findBlock, formatReceiptCurrency, renderReceiptBlocks } from "./impl";

const SUBTOTAL_CENTS = 124_900;
const DISCOUNT_CENTS = 12_490;
const TAX_CENTS = 7_869;
const GRAND_TOTAL_CENTS = SUBTOTAL_CENTS - DISCOUNT_CENTS + TAX_CENTS;

describe("printed receipt", () => {
  it("prints the subtotal, tax and grand total as currency columns", () => {
    const blocks = renderReceiptBlocks({
      subtotalCents: SUBTOTAL_CENTS,
      taxCents: TAX_CENTS,
      discountCents: DISCOUNT_CENTS,
    });

    const subtotalBlock = findBlock(blocks, "Subtotal");
    expect(subtotalBlock!.right).toBe(formatReceiptCurrency(SUBTOTAL_CENTS));

    const taxBlock = findBlock(blocks, "Tax");
    expect(taxBlock!.right).toBe(formatReceiptCurrency(TAX_CENTS));

    const totalBlock = findBlock(blocks, "TOTAL");
    expect(totalBlock!.right).toBe(formatReceiptCurrency(GRAND_TOTAL_CENTS));
    expect(totalBlock!.bold).toBe(true);
  });
});
