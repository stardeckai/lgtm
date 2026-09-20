import { describe, expect, it } from "vitest";
import { renderRunbookBlock, type RunbookForPrompt } from "./impl";

describe("renderRunbookBlock", () => {
  it("does not throw on a malformed row missing the objectives and handoffOptions arrays", () => {
    const malformed = { enabled: true, goal: "Help the caller" } as unknown as RunbookForPrompt;

    expect(() => renderRunbookBlock(malformed)).not.toThrow();
    expect(renderRunbookBlock(malformed)).toBe("## Runbook: Help the caller");
  });
});
