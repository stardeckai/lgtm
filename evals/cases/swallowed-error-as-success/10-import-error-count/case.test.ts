import { describe, expect, test } from "vitest";
import { parseInvoices } from "./impl";

describe("parseInvoices", () => {
  test("records an error for a row whose due date cannot be read", async () => {
    const report = parseInvoices([
      { number: "INV-1", amount: "$1,200.50", dueDate: "2024-04-01" },
      { number: "INV-2", amount: "$80.00", dueDate: "next tuesday" },
    ]);

    expect(report.errors).toHaveLength(1);
    expect(report.parsed).toHaveLength(1);
  });
});
