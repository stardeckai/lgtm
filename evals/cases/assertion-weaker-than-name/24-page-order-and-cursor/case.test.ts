import { describe, expect, it } from "vitest";
import { page, type Event } from "./impl";

const events: Event[] = [
  { id: "e-a", atMs: 100 },
  { id: "e-b", atMs: 400 },
  { id: "e-c", atMs: 300 },
  { id: "e-d", atMs: 200 },
];

describe("page", () => {
  it("returns events newest first and hands back a cursor that continues without gaps or repeats", () => {
    const first = page(events, null, 2);
    expect(first.items.map((event) => event.id)).toEqual(["e-b", "e-c"]);
    expect(first.nextCursor).toBe("e-c");

    const second = page(events, first.nextCursor, 2);
    expect(second.items.map((event) => event.id)).toEqual(["e-d", "e-a"]);
    expect(second.nextCursor).toBeNull();
  });
});
