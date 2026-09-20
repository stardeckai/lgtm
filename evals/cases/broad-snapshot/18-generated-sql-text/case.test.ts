import { describe, expect, test } from "vitest";
import { toSql } from "./impl";

describe("toSql", () => {
  test("numbers the limit placeholder after the where placeholders", () => {
    const { text, values } = toSql({ table: "orders", where: { tenant_id: "ten_1", status: "paid" }, limit: 50 });

    expect(text).toMatchInlineSnapshot(
      `"SELECT * FROM "orders" WHERE "tenant_id" = $1 AND "status" = $2 LIMIT $3"`,
    );
    expect(values).toEqual(["ten_1", "paid", 50]);
  });
});
