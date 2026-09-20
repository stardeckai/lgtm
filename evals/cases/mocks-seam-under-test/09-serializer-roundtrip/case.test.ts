import { describe, expect, it, vi } from "vitest";
import { resume, type Codec, type Snapshot } from "./impl";

const snapshot: Snapshot = { version: 2, cursor: "c-90", seen: ["a", "b"], updatedAt: 1712345678 };

describe("resume", () => {
  it("survives an encode and decode round trip of the sync snapshot", () => {
    const codec: Codec = {
      encode: vi.fn().mockReturnValue("2~c-90~a|b~1712345678"),
      decode: vi.fn().mockReturnValue(snapshot),
    };

    const encoded = codec.encode(snapshot);

    expect(resume(codec, encoded)).toEqual({ cursor: "c-90", skip: new Set(["a", "b"]) });
  });
});
