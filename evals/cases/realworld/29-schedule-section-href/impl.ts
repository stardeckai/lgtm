export type Locale = "en" | "fr";

export const SCHEDULE_PATH = "schedule";
export const GROUP_SECTION_ID = "group-sessions";

/** Landing-page cards link into the schedule page anchored at the group section. */
export function groupSessionsHref(locale: Locale): string {
  return `/${locale}/${SCHEDULE_PATH}#${GROUP_SECTION_ID}`;
}
