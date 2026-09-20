export type UsageRecord = { meter: string; quantity: number; creditsPerUnit: number };

export function creditsUsed(records: UsageRecord[], includedCredits: number): number {
  const raw = records.reduce((sum, record) => {
    const units = record.meter === "storage_gb_hours" ? record.quantity / 730 : record.quantity;
    return sum + units * record.creditsPerUnit;
  }, 0);
  const billable = Math.max(0, raw - includedCredits);
  return Math.ceil(billable * 100) / 100;
}
