import { describe, expect, it } from "vitest";
import { buildBatch, type Merchant, type Transfer } from "./impl";

describe("buildBatch", () => {
  it("pays out in the merchant's configured currency", () => {
    const merchants: Merchant[] = [
      { id: "mer_uk", payoutCurrency: "GBP", feeBps: 145, holdDays: 2 },
      { id: "mer_se", payoutCurrency: "SEK", feeBps: 190, holdDays: 5 },
      { id: "mer_us", payoutCurrency: "USD", feeBps: 290, holdDays: 7 },
    ];
    const kyc = merchants.map((m) => ({
      merchantId: m.id,
      status: "verified",
      documents: [
        { type: "company_registration", uploadedAt: "2023-02-01T10:00:00.000Z" },
        { type: "director_id", uploadedAt: "2023-02-03T10:00:00.000Z" },
      ],
      reviewedBy: "ops_14",
      riskScore: m.holdDays * 3,
    }));
    const bankAccounts = merchants.map((m) => ({
      merchantId: m.id,
      currency: m.payoutCurrency,
      iban: `${m.payoutCurrency.slice(0, 2)}00 0000 0000 0000`,
      holderName: `${m.id} Ltd`,
      verifiedAt: "2023-02-10T10:00:00.000Z",
    }));
    const feeSchedule = merchants.map((m) => ({
      merchantId: m.id,
      standardBps: m.feeBps,
      internationalBps: m.feeBps + 60,
      chargebackFlatCents: 1500,
      monthlyMinimumCents: 2000,
    }));
    const transfers: Transfer[] = [
      { merchantId: "mer_se", grossCents: 412_00, capturedAt: "2024-05-01T09:00:00.000Z" },
      { merchantId: "mer_se", grossCents: 118_00, capturedAt: "2024-05-01T11:30:00.000Z" },
      { merchantId: "mer_uk", grossCents: 900_00, capturedAt: "2024-05-01T12:00:00.000Z" },
      { merchantId: "mer_us", grossCents: 250_00, capturedAt: "2024-05-02T08:00:00.000Z" },
    ];

    expect(buildBatch(merchants, transfers, "mer_se").currency).toBe("SEK");
  });
});
