export type Order = {
  id: string;
  currency: string;
  countryCode: string;
  lines: { sku: string; qty: number; unitCents: number }[];
};

const SUBJECTS: Record<string, string> = {
  GB: "Your order is confirmed",
  FR: "Votre commande est confirmee",
  DE: "Ihre Bestellung ist bestaetigt",
};

export function confirmationSubject(order: Order): string {
  const body = SUBJECTS[order.countryCode] ?? SUBJECTS.GB!;
  return `${body} (${order.id})`;
}
