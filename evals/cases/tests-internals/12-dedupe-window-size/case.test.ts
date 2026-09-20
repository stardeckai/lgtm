import { describe, expect, it } from "vitest";
import { EventDeduper } from "./impl";

describe("EventDeduper", () => {
  it("forgets events once they fall out of the window", () => {
    const deduper = new EventDeduper(1_000);

    deduper.accept({ id: "e-1", type: "click", at: 0 });
    deduper.accept({ id: "e-2", type: "click", at: 500 });
    deduper.accept({ id: "e-3", type: "click", at: 2_000 });

    expect(deduper.size()).toBe(1);
  });
});
