import { describe, expect, test } from "vitest";
import { ageReceivables, type Receivable } from "./impl";

describe("ageReceivables", () => {
  test("puts every invoice in the bucket its exact day count belongs to", () => {
    const rows: Receivable[] = [
      { invoiceId: "INV-01", dueDate: "2024-07-15", openCents: 1_000 },
      { invoiceId: "INV-02", dueDate: "2024-06-30", openCents: 2_000 },
      { invoiceId: "INV-03", dueDate: "2024-06-29", openCents: 4_000 },
      { invoiceId: "INV-04", dueDate: "2024-06-15", openCents: 8_000 },
      { invoiceId: "INV-05", dueDate: "2024-05-31", openCents: 16_000 },
      { invoiceId: "INV-06", dueDate: "2024-05-30", openCents: 32_000 },
      { invoiceId: "INV-07", dueDate: "2024-05-15", openCents: 64_000 },
      { invoiceId: "INV-08", dueDate: "2024-05-01", openCents: 128_000 },
      { invoiceId: "INV-09", dueDate: "2024-04-30", openCents: 256_000 },
      { invoiceId: "INV-10", dueDate: "2024-01-02", openCents: 512_000 },
    ];

    expect(ageReceivables(rows, "2024-06-30")).toEqual({
      current: 1_000 + 2_000,
      d1to30: 4_000 + 8_000 + 16_000,
      d31to60: 32_000 + 64_000 + 128_000,
      d61plus: 256_000 + 512_000,
    });
  });
});
