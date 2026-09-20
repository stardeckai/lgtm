export const KNOWN_STATUS_KEYS = {
  invoice: { draft: 1, awaiting_payment: 1, paid: 1, payment_expired: 1, void: 1 },
  shipment: { queued: 1, in_transit: 1, delivered: 1, returned: 1 },
} as const;

export type Domain = keyof typeof KNOWN_STATUS_KEYS;
export type Tone = "neutral" | "positive" | "attention";

type Entry = { label: string; shortLabel: string; tone: Tone };

const DICTIONARY: Record<string, Record<string, Record<string, Entry>>> = {
  en: {
    invoice: {
      draft: { label: "Draft", shortLabel: "Draft", tone: "neutral" },
      awaiting_payment: { label: "Awaiting payment", shortLabel: "Awaiting", tone: "neutral" },
      paid: { label: "Paid", shortLabel: "Paid", tone: "positive" },
      payment_expired: { label: "Payment expired — contact support", shortLabel: "Expired", tone: "attention" },
      void: { label: "Voided", shortLabel: "Void", tone: "neutral" },
    },
    shipment: {
      queued: { label: "Queued", shortLabel: "Queued", tone: "neutral" },
      in_transit: { label: "In transit", shortLabel: "Transit", tone: "neutral" },
      delivered: { label: "Delivered", shortLabel: "Delivered", tone: "positive" },
      returned: { label: "Returned", shortLabel: "Returned", tone: "attention" },
    },
  },
};

export function getStatusPresentation(locale: string, domain: Domain, rawStatus: string) {
  const entry = DICTIONARY[locale]?.[domain]?.[rawStatus];
  if (!entry) {
    return { label: "In progress", shortLabel: "In progress", tone: "neutral" as Tone, known: false };
  }
  return { ...entry, known: true };
}
