export type RunbookForPrompt = {
  enabled: boolean;
  goal: string;
  objectives: string[];
  handoffOptions: string[];
};

export function renderRunbookBlock(runbook: RunbookForPrompt): string {
  if (!runbook.enabled) return "";
  const lines = [`## Runbook: ${runbook.goal}`];

  const objectives = (runbook.objectives ?? []).map((o) => o.trim()).filter(Boolean);
  if (objectives.length > 0) {
    lines.push("", "Objectives:", ...objectives.map((o) => `- ${o}`));
  }

  const handoffs = (runbook.handoffOptions ?? []).map((h) => h.trim()).filter(Boolean);
  if (handoffs.length > 0) {
    lines.push("", "Hand off to:", ...handoffs.map((h) => `- ${h}`));
  }
  return lines.join("\n");
}
