import { describe, expect, it, vi } from "vitest";
import { SheetSync } from "./impl";

describe("SheetSync", () => {
  it("imports the mapped rows and counts the ones it skipped", async () => {
    const sheets = { readRange: vi.fn().mockResolvedValue([["id", "name"], ["1", "a"], ["2", "b"], ["", ""]]) };
    const mapper = {
      toRows: vi.fn().mockReturnValue([
        { externalId: "1", values: { name: "a" } },
        { externalId: "2", values: { name: "b" } },
      ]),
    };
    const store = { upsert: vi.fn().mockResolvedValue(2) };
    const sync = new SheetSync(sheets, store, mapper);

    const result = await sync.run("sheet-1");

    expect(result).toEqual({ imported: 2, skipped: 1 });
  });
});
