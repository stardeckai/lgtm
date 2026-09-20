import { describe, expect, it } from "vitest";
import { invoiceTotalCents, lineTaxCents, type Line } from "./impl";

const lines: Line[] = [
  { description: "Consulting", subtotalCents: 2000, taxRate: 0.05 },
  { description: "Hosting", subtotalCents: 4000, taxRate: 0.1 },
];

describe("lineTaxCents", () => {
  it("adds the tax each line owes to the invoice total", () => {
    expect(lineTaxCents(lines[0]!)).toBe(100);
    expect(lineTaxCents(lines[1]!)).toBe(400);
    expect(invoiceTotalCents(lines)).toBe(6500);
  });
});
