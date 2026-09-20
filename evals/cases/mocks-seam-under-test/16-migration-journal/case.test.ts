import { describe, expect, it, vi } from "vitest";
import { migrate, type Journal, type MigrationFile, type SqlRunner } from "./impl";

const files: MigrationFile[] = [
  { id: "0001_init", sql: "create table a()", checksum: "c1" },
  { id: "0002_index", sql: "create index i on a(x)", checksum: "c2" },
];

const runner: SqlRunner = { exec: vi.fn().mockResolvedValue(undefined) };

describe("migrate", () => {
  it("skips a migration that the journal already records as applied", async () => {
    const journal: Journal = {
      applied: vi.fn().mockResolvedValue([{ id: "0001_init", checksum: "c1" }]),
      record: vi.fn().mockResolvedValue(undefined),
    };

    const ran = await migrate(journal, runner, files, 1);

    expect(ran).toEqual(["0002_index"]);
    expect(journal.record).toHaveBeenCalled();
  });
});
