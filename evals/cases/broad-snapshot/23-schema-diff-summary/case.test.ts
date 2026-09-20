import { describe, expect, it } from "vitest";
import { diffSchema, type Table } from "./impl";

describe("diffSchema", () => {
  it("reports a nullable column becoming not null as a tightening, not an add", () => {
    const before: Table[] = [
      { name: "orders", columns: [{ name: "id", type: "uuid", nullable: false }, { name: "note", type: "text", nullable: true }] },
    ];
    const after: Table[] = [
      { name: "orders", columns: [{ name: "id", type: "uuid", nullable: false }, { name: "note", type: "text", nullable: false }] },
    ];

    expect(diffSchema(before, after)).toMatchInlineSnapshot(`
      [
        "tighten orders.note to not null",
      ]
    `);
  });
});
