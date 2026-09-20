import { beforeEach, describe, expect, it, vi } from "vitest";
import { runUpstreamSync, type RunStore, type Workspace } from "./impl";

const RUN_ID = "run_1";
let workspace: Workspace;
let store: RunStore;
let resolveConflicts: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  workspace = {
    mergeFromUpstream: vi
      .fn()
      .mockResolvedValue({ merged: false, conflictPaths: ["src/app/api/orders/route.ts"] }),
    exec: vi.fn().mockResolvedValue({ output: "", exitCode: 0 }),
    commit: vi.fn().mockResolvedValue({ sha: "abc123" }),
  };
  store = { updateRun: vi.fn().mockResolvedValue(undefined) };
  resolveConflicts = vi.fn().mockResolvedValue(undefined);
});

describe("runUpstreamSync", () => {
  it("concludes the merge the workspace is holding when it commits the resolution", async () => {
    await runUpstreamSync(workspace, store, RUN_ID, resolveConflicts);

    expect(workspace.exec).toHaveBeenCalledWith("git add -A");
    expect(workspace.commit).toHaveBeenCalledWith("Merge upstream sync (resolved conflicts)", {
      push: true,
      stageAll: false,
      concludesMerge: true,
    });
  });
});
