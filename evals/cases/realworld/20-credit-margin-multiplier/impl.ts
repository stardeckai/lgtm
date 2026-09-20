export const CREDIT_MARGIN_MULTIPLIER = 1.75;

/**
 * Wholesale cost in credits, marked up before it is charged to a workspace.
 * Non-positive costs are free rather than a negative charge.
 */
export function applyCreditMargin(wholesaleCredits: number): number {
  if (wholesaleCredits <= 0) return 0;
  return wholesaleCredits * CREDIT_MARGIN_MULTIPLIER;
}
