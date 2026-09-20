import { describe, expect, it } from "vitest";
import { assignReturnedCopies, HoldQueue } from "./impl";

describe("assignReturnedCopies", () => {
  it("hands returned copies to the longest-waiting patrons and drops them off the queue", () => {
    const queue = new HoldQueue();
    queue.place("rosa", 300);
    queue.place("ivan", 100);
    queue.place("mei", 200);
    queue.place("ivan", 400);

    expect(assignReturnedCopies(queue, 2)).toEqual(["ivan", "mei"]);
    expect(queue.list().map((h) => h.patron)).toEqual(["rosa"]);
    expect(assignReturnedCopies(queue, 2)).toEqual(["rosa"]);
    expect(queue.list()).toEqual([]);
  });
});
