import { describe, expect, it, vi } from "vitest";
import { runColumnMigration, type Steps } from "./impl";

describe("runColumnMigration", () => {
  it("backfills every batch before dropping the legacy column", async () => {
    const steps: Steps = {
      lockTable: vi.fn().mockResolvedValue(undefined),
      backfill: vi.fn().mockResolvedValue(undefined),
      dropLegacyColumn: vi.fn().mockResolvedValue(undefined),
      unlockTable: vi.fn().mockResolvedValue(undefined),
    };

    await runColumnMigration(steps, 1_200);

    const backfillOrder = (steps.backfill as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0]!;
    const dropOrder = (steps.dropLegacyColumn as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0]!;
    expect(backfillOrder).toBeLessThan(dropOrder);
  });
});
