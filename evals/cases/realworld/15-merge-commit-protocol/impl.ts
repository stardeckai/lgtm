export type Workspace = {
  mergeFromUpstream: () => Promise<{ merged: boolean; conflictPaths: string[] }>;
  exec: (command: string) => Promise<{ output: string; exitCode: number }>;
  commit: (
    message: string,
    options: { push: boolean; stageAll: boolean; concludesMerge: boolean }
  ) => Promise<{ sha: string }>;
};

export type RunStore = { updateRun: (runId: string, patch: Record<string, unknown>) => Promise<void> };

export async function runUpstreamSync(
  workspace: Workspace,
  store: RunStore,
  runId: string,
  resolveConflicts: (paths: string[]) => Promise<void>
) {
  const merge = await workspace.mergeFromUpstream();
  if (merge.merged) {
    await store.updateRun(runId, { status: "merged", conflictPaths: [] });
    return "merged" as const;
  }

  await store.updateRun(runId, { status: "conflicts_resolving", conflictPaths: merge.conflictPaths });
  await resolveConflicts(merge.conflictPaths);
  await workspace.exec("git add -A");
  await workspace.commit("Merge upstream sync (resolved conflicts)", {
    push: true,
    stageAll: false,
    concludesMerge: true,
  });
  await store.updateRun(runId, { status: "awaiting_review" });
  return "awaiting_review" as const;
}
