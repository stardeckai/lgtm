import { describe, expect, it } from "vitest";
import { buttonVariantMap } from "./impl";

describe("buttonVariants", () => {
  it("carries no surface-prefixed variant or size", () => {
    const names = Object.values(buttonVariantMap).flatMap((group) => Object.keys(group));

    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect(name, `${name} is surface-scoped`).not.toMatch(/^(staff|admin|kiosk|web)-/);
    }
  });
});
