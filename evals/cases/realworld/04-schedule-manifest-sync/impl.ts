import { syncSchedulesFromManifest } from "./store";

export type ScheduleEntry = { id: string; cron: string };

export async function discoverAndSyncSchedules(appId: string, baseUrl: string) {
  const response = await fetch(`${baseUrl}/api/schedules/manifest`, {
    method: "GET",
    redirect: "manual",
  });
  if (response.status >= 300 && response.status < 400) {
    throw new Error(`schedule manifest was redirected (${response.status})`);
  }
  if (!response.ok) throw new Error(`schedule manifest failed (${response.status})`);

  const body = (await response.json()) as { schedules: ScheduleEntry[] };
  const result = await syncSchedulesFromManifest(appId, body.schedules);
  return { total: result.added + result.updated, orphaned: result.orphaned };
}
