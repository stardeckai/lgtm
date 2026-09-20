import { describe, expect, it } from "vitest";
import { RevisionLog } from "./impl";

describe("RevisionLog", () => {
  it("counts nothing when one side of the comparison is not in the log", () => {
    const log = new RevisionLog();
    log.restore([
      { number: 1, authorId: "u_1", body: "alpha\nbeta" },
      { number: 4, authorId: "u_2", body: "alpha\ngamma\ndelta" },
    ]);

    expect(log.changedLinesBetween(1, 2)).toBe(0);
  });
});
