import { describe, expect, it } from "vitest";
import { describeEvidence } from "./impl";

describe("stored consent evidence", () => {
  it("falls back to literal text for a truncated envelope rather than throwing", () => {
    expect(describeEvidence('{"channel":"web"')).toEqual({
      kind: "text",
      text: '{"channel":"web"',
    });
  });

  it("describes a complete acceptance envelope instead of rendering it as an image", () => {
    const envelope = JSON.stringify({
      channel: "web",
      locale: "en",
      acceptedAt: "2026-03-14T08:12:05.417Z",
    });
    expect(describeEvidence(envelope)).toEqual({
      kind: "acceptance",
      channel: "web",
      locale: "en",
      acceptedAt: "2026-03-14T08:12:05.417Z",
    });
  });
});
