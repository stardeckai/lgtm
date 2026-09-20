export type Quote = { carrier: string; cents: number; etaDays: number };

export function quoteShipping(weightGrams: number, express: boolean): Quote {
  const base =
    weightGrams <= 1000 ? 599 : 599 + Math.ceil((weightGrams - 1000) / 500) * 120;
  return express
    ? { carrier: "air", cents: base * 2, etaDays: 1 }
    : { carrier: "ground", cents: base, etaDays: 4 };
}
