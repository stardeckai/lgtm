import { describe, expect, it, vi } from "vitest";
import { runNightlyRollup } from "./impl";

vi.mock("./metrics", () => ({ metrics: { gauge: vi.fn() } }));
vi.mock("./warehouse", () => ({ warehouse: { rollup: vi.fn().mockResolvedValue(1_234) } }));
vi.mock("./slack", () => ({ slack: { post: vi.fn().mockResolvedValue(undefined) } }));
vi.mock("./lock", () => ({
  lock: { acquire: vi.fn().mockResolvedValue(true), release: vi.fn().mockResolvedValue(undefined) },
}));

describe("runNightlyRollup", () => {
  it("rolls up the day and reports the row count", async () => {
    const result = await runNightlyRollup("2024-08-01");

    expect(result).toEqual({ rows: 1_234, skipped: false });
  });
});
