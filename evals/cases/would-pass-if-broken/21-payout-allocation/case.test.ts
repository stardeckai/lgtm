import { describe, expect, it } from "vitest";
import { allocateCents } from "./impl";

describe("allocateCents", () => {
  it("gives the rounding remainder to the last payee so the split sums to the total", () => {
    const split = allocateCents(10000, [
      { payeeId: "a", basisPoints: 3333 },
      { payeeId: "b", basisPoints: 3333 },
      { payeeId: "c", basisPoints: 3334 },
    ]);

    expect(split).toEqual({ a: 3333, b: 3333, c: 3334 });

    const odd = allocateCents(1001, [
      { payeeId: "a", basisPoints: 5000 },
      { payeeId: "b", basisPoints: 5000 },
    ]);

    expect(odd).toEqual({ a: 500, b: 501 });
  });
});
