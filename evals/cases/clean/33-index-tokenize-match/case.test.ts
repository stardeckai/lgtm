import { describe, expect, it } from "vitest";
import { SearchIndex } from "./impl";

describe("SearchIndex", () => {
  it("matches a query written without accents and requires every token to be present", () => {
    const index = new SearchIndex();
    index.add("d1", "Café near the Old Bridge");
    index.add("d2", "Bridge maintenance report");
    index.add("d3", "cafe supplies");

    expect(index.query("cafe")).toEqual(["d1", "d3"]);
    expect(index.query("bridge café")).toEqual(["d1"]);
    expect(index.query("bridge report")).toEqual(["d2"]);
    expect(index.query("a")).toEqual([]);
  });
});
