export type Project = { id: string; version: string; deps: Record<string, string> };

export type Step = { version: string; apply: (project: Project) => Project };

export const STEPS: Step[] = [
  {
    version: "7.4.0",
    apply: (project) => ({ ...project, deps: { ...project.deps, "email-sdk": "2.1.0" } }),
  },
  {
    version: "7.5.0",
    apply: (project) => ({ ...project, deps: { ...project.deps, "payments-sdk": "4.0.0" } }),
  },
];

export function upgrade(project: Project, target: string): Project {
  return STEPS.filter((step) => step.version <= target).reduce(
    (acc, step) => ({ ...step.apply(acc), version: step.version }),
    project,
  );
}
