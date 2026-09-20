export type Playbook = { id: string; description: string; keywords: string[] };

export const PLAYBOOKS: Playbook[] = [
  {
    id: "access-review",
    description: "Use for admins, role changes and access reviews across a workspace.",
    keywords: ["role", "permission", "access", "admin"],
  },
  {
    id: "billing-dispute",
    description: "Use for refunds, chargebacks and disputed invoices.",
    keywords: ["refund", "chargeback", "invoice"],
  },
];

export function routeRequest(request: string): Playbook | null {
  const words = request.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  let best: { playbook: Playbook; hits: number } | null = null;
  for (const playbook of PLAYBOOKS) {
    const hits = playbook.keywords.filter((k) => words.includes(k)).length;
    if (hits > 0 && (!best || hits > best.hits)) best = { playbook, hits };
  }
  return best?.playbook ?? null;
}
