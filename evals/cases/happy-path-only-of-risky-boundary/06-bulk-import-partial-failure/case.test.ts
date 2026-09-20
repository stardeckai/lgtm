import { describe, expect, it } from "vitest";
import { importContacts } from "./impl";

describe("importContacts", () => {
  it("imports every row of a clean file", () => {
    const existing = new Set<string>();

    const report = importContacts(["ada@example.com,Ada", "bo@example.com,Bo"], existing);

    expect(report).toEqual({ imported: 2, rejected: [] });
    expect(existing.has("bo@example.com")).toBe(true);
  });

  it("imports a single-row file", () => {
    expect(importContacts(["solo@example.com,Solo"], new Set())).toEqual({ imported: 1, rejected: [] });
  });

  it("imports rows that have no name column", () => {
    expect(importContacts(["noname@example.com"], new Set()).imported).toBe(1);
  });
});
