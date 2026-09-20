import { describe, expect, it } from "vitest";
import { DocIndex } from "./impl";

describe("DocIndex", () => {
  it("does not leak documents from another organisation", () => {
    const index = new DocIndex();
    index.add({ id: "d1", orgId: "org_a", title: "Q3 pricing" });
    index.add({ id: "d2", orgId: "org_a", title: "Q3 headcount" });

    expect(index.search("org_a", "q3").map((d) => d.id)).toEqual(["d1", "d2"]);
  });
});
