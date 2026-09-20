export type VatSplit = { netCents: number; vatCents: number };

export function splitVatCents(grossCents: number, ratePercent: number): VatSplit {
  const net = Math.round((grossCents * 100) / (100 + ratePercent));
  return { netCents: net, vatCents: grossCents - net };
}
