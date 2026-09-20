export const SPECIES = ["lavender", "chamomile", "borage"] as const;
export type Species = (typeof SPECIES)[number];
