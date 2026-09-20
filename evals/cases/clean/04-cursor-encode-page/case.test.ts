import { describe, expect, it } from "vitest";
import { fetchPage, type Row } from "./impl";

describe("fetchPage", () => {
  it("walks every row exactly once across pages that share a timestamp", () => {
    const rows: Row[] = [
      { id: "a", createdAt: 100 },
      { id: "b", createdAt: 100 },
      { id: "c", createdAt: 200 },
      { id: "d", createdAt: 300 },
      { id: "e", createdAt: 300 },
    ];

    const seen: string[] = [];
    let cursor: string | null = null;
    do {
      const page: { rows: Row[]; next: string | null } = fetchPage(rows, cursor, 2);
      seen.push(...page.rows.map((r) => r.id));
      cursor = page.next;
    } while (cursor !== null);

    expect(seen).toEqual(["a", "b", "c", "d", "e"]);
  });
});
