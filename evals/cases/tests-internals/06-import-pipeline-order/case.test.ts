import { describe, expect, it, vi } from "vitest";
import { importContacts, steps } from "./impl";

describe("importContacts", () => {
  it("removes duplicate contacts from an uploaded file", () => {
    const normalize = vi.spyOn(steps, "normalize");
    const dedupe = vi.spyOn(steps, "dedupe");
    const toContacts = vi.spyOn(steps, "toContacts");

    importContacts([{ email: " A@Example.com ", name: "A" }, { email: "a@example.com", name: "A" }]);

    expect(normalize.mock.invocationCallOrder[0]!).toBeLessThan(dedupe.mock.invocationCallOrder[0]!);
    expect(dedupe.mock.invocationCallOrder[0]!).toBeLessThan(toContacts.mock.invocationCallOrder[0]!);
  });
});
