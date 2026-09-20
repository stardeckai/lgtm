import { describe, expect, it } from "vitest";
import { timelineLabels, type OrderEvent } from "./impl";

const rows = [
  { type: "placed", at: 10 },
  { type: "cancelled", at: 30, reason: "" },
];

describe("timelineLabels", () => {
  it("annotates a cancellation with the reason it carried", () => {
    const events = rows.map((row) => row as OrderEvent);

    expect(timelineLabels(events)).toEqual(["placed", "cancelled ()"]);
  });
});
