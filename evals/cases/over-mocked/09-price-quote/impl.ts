import { discountBpsFor } from "./discount-rules";
import { taxBpsFor } from "./tax-rules";
import { shippingCentsFor } from "./shipping-rules";

export type QuoteInput = {
  customerTier: "bronze" | "gold";
  subtotalCents: number;
  country: string;
  weightGrams: number;
};

export function quote(input: QuoteInput): { total: number; discount: number; tax: number; shipping: number } {
  const discount = Math.round((input.subtotalCents * discountBpsFor(input.customerTier, input.subtotalCents)) / 10_000);
  const taxed = input.subtotalCents - discount;
  const tax = Math.round((taxed * taxBpsFor(input.country)) / 10_000);
  const shipping = shippingCentsFor(input.country, input.weightGrams);
  return { total: taxed + tax + shipping, discount, tax, shipping };
}
