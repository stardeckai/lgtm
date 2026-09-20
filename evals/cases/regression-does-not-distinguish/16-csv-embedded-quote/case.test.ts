import { describe, expect, it } from "vitest";
import { csvRow } from "./impl";

describe("csvRow", () => {
  it("escapes a field that contains a quote character", () => {
    expect(csvRow(["ACME Ltd", "Berlin"])).toBe("ACME Ltd,Berlin");
    expect(csvRow(["ACME, Ltd", "Berlin"])).toBe('"ACME, Ltd",Berlin');
    expect(csvRow(["line one\nline two"])).toBe('"line one\nline two"');
  });
});
