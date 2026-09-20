import React from "react";

export type Severity = "info" | "warning" | "critical";

const LABELS: Record<Severity, string> = {
  info: "Healthy",
  warning: "Degraded",
  critical: "Down",
};

export function StatusBadge({ severity, count }: { severity: Severity; count: number }) {
  return (
    <span className={`badge badge--${severity} ${count > 9 ? "badge--wide" : ""}`.trim()}>
      {LABELS[severity]}
      {count > 0 ? ` (${count > 9 ? "9+" : count})` : ""}
    </span>
  );
}
