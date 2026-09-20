import { describe, expect, it } from "vitest";
import { commissionCents, type Deal } from "./impl";

const deals: Array<{ deal: Deal; attainment: number }> = [
  { deal: { id: "d-1", valueCents: 1_200_00, isRenewal: false }, attainment: 1.15 },
  { deal: { id: "d-2", valueCents: 1_200_00, isRenewal: true }, attainment: 1.15 },
  { deal: { id: "d-3", valueCents: 840_00, isRenewal: false }, attainment: 0.85 },
  { deal: { id: "d-4", valueCents: 840_00, isRenewal: false }, attainment: 0.4 },
];

describe("commissionCents", () => {
  it("halves the accelerator rate on renewals", () => {
    const expected = deals.map(({ deal, attainment }) => {
      const rate = attainment >= 1 ? 0.12 : attainment >= 0.8 ? 0.09 : 0.06;
      return Math.round(deal.valueCents * (deal.isRenewal ? rate * 0.5 : rate));
    });

    expect(deals.map(({ deal, attainment }) => commissionCents(deal, attainment))).toEqual(expected);
  });
});
