import { describe, expect, it, vi } from "vitest";
import { importCatalog, type Downloader } from "./impl";

const csv = ["sku,qty,price", "MUG-1,4,12.50", ",2,3.00", "PEN-9,-1,1.20", "PEN-9,3,1.21"].join("\n");

const downloader: Downloader = { text: vi.fn().mockResolvedValue(csv) };

describe("importCatalog", () => {
  it("reports the source line number of each rejected row and keeps the rest", async () => {
    await expect(importCatalog(downloader, "https://files.example/catalog.csv")).resolves.toEqual({
      rows: [
        { sku: "MUG-1", qty: 4, unitCents: 1250 },
        { sku: "PEN-9", qty: 3, unitCents: 121 },
      ],
      skipped: [
        { line: 3, reason: "missing sku" },
        { line: 4, reason: "bad quantity" },
      ],
    });
  });
});
