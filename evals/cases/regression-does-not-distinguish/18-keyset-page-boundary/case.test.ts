import { describe, expect, it } from "vitest";
import { page, type Row } from "./impl";

describe("page", () => {
  it("does not repeat the last row of the previous page", () => {
    const rows: Row[] = [
      { id: "a", createdAt: 10 },
      { id: "b", createdAt: 20 },
      { id: "c", createdAt: 30 },
      { id: "d", createdAt: 40 },
    ];

    const first = page(rows, null, 2);
    const second = page(rows, first[first.length - 1]!.createdAt, 2);

    expect(first.map((r) => r.id)).toEqual(["a", "b"]);
    expect(second.map((r) => r.id)).toEqual(["c", "d"]);
  });
});
