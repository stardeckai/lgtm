import { describe, expect, it } from "vitest";
import { toProjectDto } from "./impl";

describe("toProjectDto", () => {
  it("renames the database columns to the API field names", () => {
    expect(
      toProjectDto({
        project_id: "prj_1",
        project_name: "Atlas",
        owner_id: "usr_4",
        created_at: "2024-01-05T00:00:00.000Z",
      }),
    ).toEqual({ id: "prj_1", name: "Atlas", ownerId: "usr_4", createdAt: "2024-01-05T00:00:00.000Z" });
  });
});
