import { describe, expect, it } from "vitest";
import { getStatusPresentation, KNOWN_STATUS_KEYS } from "./impl";

describe("localized status presentation", () => {
  it("resolves every known raw status to a human label", () => {
    for (const [domain, statuses] of Object.entries(KNOWN_STATUS_KEYS)) {
      for (const rawStatus of Object.keys(statuses)) {
        const presented = getStatusPresentation("en", domain as keyof typeof KNOWN_STATUS_KEYS, rawStatus);

        expect(presented.known, `${domain}.${rawStatus} should be known`).toBe(true);
        expect(presented.label).not.toBe(rawStatus);
        expect(presented.label).not.toContain("_");
        expect(presented.shortLabel.length).toBeGreaterThan(0);
      }
    }
  });
});
