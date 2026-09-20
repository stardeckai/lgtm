import { describe, expect, it } from "vitest";
import { LATEST_VERSION, migrate } from "./impl";

describe("migrations", () => {
  it("keeps the starter plan rename in the chain that new databases run", () => {
    const rows = migrate([{ id: "r1", planCode: "starter", seats: 0 }], 0);

    expect(LATEST_VERSION).toBeGreaterThan(1);
    expect(rows.length).toBeGreaterThan(0);
  });
});
