import { describe, expect, it } from "vitest";
import { buildMultipart, parseMultipart, type Part } from "./impl";

describe("multipart", () => {
  it("reads back a file part with its filename and a text part with a blank line in it", () => {
    const parts: Part[] = [
      { name: "note", contentType: "text/plain", body: "first line\r\n\r\nsecond line" },
      { name: "receipt", filename: "march.pdf", contentType: "application/pdf", body: "%PDF-1.4" },
    ];

    const body = buildMultipart("X-SEP", parts);

    expect(body.endsWith("--X-SEP--\r\n")).toBe(true);
    expect(parseMultipart("X-SEP", body)).toEqual(parts);
  });
});
