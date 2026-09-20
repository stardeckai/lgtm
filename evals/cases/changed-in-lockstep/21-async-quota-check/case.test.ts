import { describe, expect, it } from "vitest";
import { QuotaBook } from "./impl";

describe("QuotaBook", () => {
  it("refuses the request that would cross the limit and leaves the counter alone", async () => {
    const book = new QuotaBook(new Map([["org_1", { orgId: "org_1", used: 90, limit: 100 }]]));

    await expect(book.consume("org_1", 10)).resolves.toEqual({ granted: true, used: 100 });
    await expect(book.consume("org_1", 1)).resolves.toEqual({ granted: false, used: 100 });
  });
});
