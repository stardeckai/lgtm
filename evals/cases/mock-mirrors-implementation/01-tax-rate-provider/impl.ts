export interface TaxRateProvider {
  ratePercentFor(region: string, category: string): number;
}

export class StatutoryTaxRates implements TaxRateProvider {
  ratePercentFor(region: string, category: string): number {
    if (category === "food") return region === "EU" ? 7 : 0;
    if (category === "digital") return region === "EU" ? 21 : 8;
    return region === "EU" ? 21 : 6;
  }
}

export type Basket = { region: string; category: string; netCents: number };

export function grossCents(provider: TaxRateProvider, basket: Basket): number {
  const percent = provider.ratePercentFor(basket.region, basket.category);
  return basket.netCents + Math.round((basket.netCents * percent) / 100);
}
