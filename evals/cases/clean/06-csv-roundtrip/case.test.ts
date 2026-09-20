import { describe, expect, it } from "vitest";
import { parseCsv, serializeCsv } from "./impl";

describe("csv", () => {
  it("reads back cells containing commas, quotes and newlines exactly as written", () => {
    const rows = [
      ["name", "note"],
      ['ACME, Inc', 'he said "hi"'],
      ["multi\r\nline", ""],
    ];

    const text = serializeCsv(rows);

    expect(text.split("\r\n")[0]).toBe("name,note");
    expect(parseCsv(text)).toEqual(rows);
  });
});
