import { describe, expect, it } from "vitest";
import { receiptHtml } from "./impl";

describe("receiptHtml", () => {
  it("adds tax to the subtotal on the total row", () => {
    const html = receiptHtml({
      number: "R-4471",
      customerName: "Mira Okonkwo",
      lines: [
        { label: "Annual plan", cents: 24_000 },
        { label: "Extra seats", cents: 6_000 },
      ],
      taxCents: 6_000,
    });

    expect(html).toMatchInlineSnapshot(`
      "<html>
        <body style="font-family: Helvetica, Arial, sans-serif">
          <h1>Receipt R-4471</h1>
          <p>Thanks, Mira Okonkwo.</p>
          <table class="lines">
            <tr><td class="label">Annual plan</td><td class="amount">$240.00</td></tr>
            <tr><td class="label">Extra seats</td><td class="amount">$60.00</td></tr>
            <tr><td class="label">Tax</td><td class="amount">$60.00</td></tr>
            <tr class="total"><td>Total</td><td>$360.00</td></tr>
          </table>
        </body>
      </html>"
    `);
  });
});
