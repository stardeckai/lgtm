import { describe, expect, it } from "vitest";
import { buttonClass } from "./impl";

describe("buttonClass", () => {
  it("lets a caller override a utility instead of emitting both", () => {
    expect(buttonClass("danger", "sm")).toBe(
      "bg-destructive text-destructive-foreground h-8 px-2 cursor-pointer",
    );
    expect(buttonClass("danger", "sm", "bg-muted px-6")).toBe(
      "bg-muted text-destructive-foreground h-8 px-6 cursor-pointer",
    );
  });
});
