import { describe, expect, it } from "vitest";
import { TaskBuffer } from "./impl";

describe("TaskBuffer", () => {
  it("hands out each due task once and keeps the future ones", () => {
    const buffer = new TaskBuffer();
    buffer.add({ id: "t1", runAfterMs: 100 });
    buffer.add({ id: "t2", runAfterMs: 500 });

    expect(buffer.due(200).map((t) => t.id)).toEqual(["t1"]);
    expect(buffer.due(200)).toEqual([]);
    expect(buffer.due(600).map((t) => t.id)).toEqual(["t2"]);
  });
});
