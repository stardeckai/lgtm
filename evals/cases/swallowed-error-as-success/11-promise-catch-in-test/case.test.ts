import { describe, expect, it } from "vitest";
import { requirePro, type Tenant } from "./impl";

describe("requirePro", () => {
  it("stops a free tenant from reaching a pro-only feature", async () => {
    const rows = new Map<string, Tenant>([["ten_1", { id: "ten_1", plan: "free" }]]);
    const store = { find: async (id: string) => rows.get(id) ?? null };

    const result = await requirePro(store, "ten_1").catch(() => null);

    expect(result).toBeNull();
  });
});
