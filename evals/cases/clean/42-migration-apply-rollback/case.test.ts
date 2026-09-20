import { describe, expect, it } from "vitest";
import { runMigrations, Table, type Migration } from "./impl";

describe("runMigrations", () => {
  it("keeps the migrations that succeeded and leaves the failing one's table untouched", () => {
    const table = new Table(["id", "email"], [{ id: 1, email: "a@example.com" }, { id: 2, email: null }]);
    const migrations: Migration[] = [
      {
        id: "0001-add-status",
        up: (t) => {
          t.columns.push("status");
          for (const row of t.rows) row["status"] = "active";
        },
        down: (t) => {
          t.columns = t.columns.filter((c) => c !== "status");
        },
      },
      {
        id: "0002-require-email",
        up: (t) => {
          if (t.rows.some((row) => row["email"] === null)) throw new Error("null email present");
        },
        down: () => {},
      },
    ];

    const result = runMigrations(table, migrations);

    expect(result.applied).toEqual(["0001-add-status"]);
    expect(result.table.columns).toEqual(["id", "email", "status"]);
    expect(result.table.rows).toEqual([
      { id: 1, email: "a@example.com", status: "active" },
      { id: 2, email: null, status: "active" },
    ]);
    expect(table.columns).toEqual(["id", "email"]);
  });
});
