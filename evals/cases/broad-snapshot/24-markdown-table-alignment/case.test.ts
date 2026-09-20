import { describe, expect, it } from "vitest";
import { markdownTable } from "./impl";

describe("markdownTable", () => {
  it("right-aligns a numeric column and marks it with a trailing colon in the rule", () => {
    const table = markdownTable(
      [
        { header: "Item", align: "left" },
        { header: "Cents", align: "right" },
      ],
      [
        ["Mug", "500"],
        ["Notebook", "1250"],
      ],
    );

    expect(table).toMatchInlineSnapshot(`
      "| Item     | Cents |
      | -------- | ----: |
      | Mug      |   500 |
      | Notebook |  1250 |"
    `);
  });
});
