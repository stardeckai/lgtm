import { describe, expect, it } from "vitest";
import { pluralCategory, pluralize } from "./impl";

describe("pluralCategory", () => {
  it("puts the teens in the many bucket even though their last digit says otherwise", () => {
    expect(pluralCategory("ru", 1)).toBe("one");
    expect(pluralCategory("ru", 11)).toBe("many");
    expect(pluralCategory("ru", 21)).toBe("one");
    expect(pluralCategory("ru", 3)).toBe("few");
    expect(pluralCategory("ru", 13)).toBe("many");
    expect(pluralCategory("pl", 1)).toBe("one");
    expect(pluralCategory("pl", 21)).toBe("many");
    expect(pluralCategory("en", 0)).toBe("other");
    expect(pluralize("en", 3, { one: "{n} file", other: "{n} files" })).toBe("3 files");
  });
});
