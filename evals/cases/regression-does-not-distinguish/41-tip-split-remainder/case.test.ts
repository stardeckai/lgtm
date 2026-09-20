import { describe, expect, it } from "vitest";
import { splitTipCents } from "./impl";

describe("splitTipCents", () => {
  it("gives every member of the shift an equal share of the pooled tips", () => {
    expect(splitTipCents(1200, 4)).toEqual([300, 300, 300, 300]);
    expect(splitTipCents(900, 3)).toEqual([300, 300, 300]);
    expect(splitTipCents(500, 1)).toEqual([500]);
  });
});
