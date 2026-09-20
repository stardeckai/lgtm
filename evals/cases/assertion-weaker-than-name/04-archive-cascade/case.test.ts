import { describe, expect, it } from "vitest";
import { Workspace } from "./impl";

describe("Workspace.archiveProject", () => {
  it("archives the project and cascades the archive down to all of its tasks", () => {
    const workspace = new Workspace(
      [{ id: "p-1", archived: false }],
      [
        { id: "t-1", projectId: "p-1", state: "open" },
        { id: "t-2", projectId: "p-1", state: "open" },
      ],
    );

    workspace.archiveProject("p-1");

    expect(workspace.projects[0]?.archived).toBe(true);
  });
});
