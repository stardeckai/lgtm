import { describe, expect, it } from "vitest";
import { topHits, type Hit } from "./impl";

describe("topHits", () => {
  it("returns one page of the highest scoring hits", () => {
    const hits: Hit[] = Array.from({ length: 80 }, (_, i) => ({ id: `h${i}`, score: 100 - i }));

    const page = topHits(hits);

    expect(page).toHaveLength(20);
    expect(page[0]!.id).toBe("h0");
    expect(page[19]!.id).toBe("h19");
  });
});
