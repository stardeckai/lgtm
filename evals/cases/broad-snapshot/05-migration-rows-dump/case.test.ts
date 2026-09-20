import { describe, expect, it } from "vitest";
import { migrateUsers, type LegacyUser } from "./impl";

describe("migrateUsers", () => {
  it("reads the admin and suspended bits out of the legacy flags column", () => {
    const rows: LegacyUser[] = [
      { id: 1, full_name: "Ada Lovelace", email: "Ada@Example.COM", created: "2019-03-04", flags: 1 },
      { id: 2, full_name: "Grace Brewster Hopper", email: "grace@example.com", created: "2020-07-19", flags: 2 },
      { id: 3, full_name: "Alan Turing", email: "alan@example.com", created: "2021-11-30", flags: 3 },
      { id: 4, full_name: "Katherine Johnson", email: "kj@example.com", created: "2022-01-15", flags: 0 },
    ];

    expect(migrateUsers(rows)).toMatchSnapshot();
  });
});
