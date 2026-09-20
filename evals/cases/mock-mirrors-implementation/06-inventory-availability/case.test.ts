import { describe, expect, it } from "vitest";
import { fulfilment, type LineRequest, type StockReader, type StockRow } from "./impl";

const rows: StockRow[] = [
  { sku: "A-1", onHand: 4, reserved: 4, incoming: 10 },
  { sku: "B-2", onHand: 2, reserved: 0, incoming: 0 },
];

const reader: StockReader = {
  available(sku) {
    const row = rows.find((r) => r.sku === sku);
    if (!row) return 0;
    return Math.max(0, row.onHand - row.reserved) + row.incoming;
  },
};

const lines: LineRequest[] = [
  { sku: "A-1", qty: 9 },
  { sku: "B-2", qty: 5 },
];

describe("fulfilment", () => {
  it("counts incoming stock towards availability", () => {
    expect(fulfilment(reader, lines)).toBe("partial");
  });
});
