export const ICON_REGISTRY = {
  generic: "/icons/generic.svg",
  workshop: "/icons/workshop.svg",
  briefing: "/icons/briefing.svg",
  onboarding: "/icons/onboarding.svg",
} as const;

export type IconKey = keyof typeof ICON_REGISTRY;

const NAME_HINTS: Array<[RegExp, IconKey]> = [
  [/workshop/i, "workshop"],
  [/briefing/i, "briefing"],
  [/onboarding|kickoff/i, "onboarding"],
];

export function resolveSessionIcon(iconKey: string | null, sessionName: string | null): string {
  if (iconKey && iconKey in ICON_REGISTRY) return ICON_REGISTRY[iconKey as IconKey];
  for (const [pattern, key] of NAME_HINTS) {
    if (sessionName && pattern.test(sessionName)) return ICON_REGISTRY[key];
  }
  return ICON_REGISTRY.generic;
}
