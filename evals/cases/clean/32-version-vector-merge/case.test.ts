import { describe, expect, it } from "vitest";
import { bump, merge, type Doc } from "./impl";

describe("merge", () => {
  it("takes the descendant automatically and surfaces a conflict for concurrent edits", () => {
    const base: Doc = { value: "draft", version: { a: 1, b: 1 } };
    const mine: Doc = { value: "mine", version: bump(base.version, "a") };
    const theirs: Doc = { value: "theirs", version: bump(base.version, "b") };
    const laterMine: Doc = { value: "mine-2", version: bump(mine.version, "a") };

    expect(merge(mine, base)).toEqual(mine);
    expect(merge(base, mine)).toEqual(mine);
    expect(merge(laterMine, mine)).toEqual(laterMine);
    expect(merge(mine, theirs)).toEqual({ conflict: [mine, theirs] });
  });
});
