import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSyncSchedulesFromManifest = vi.fn();
vi.mock("./store", () => ({
  syncSchedulesFromManifest: (...args: unknown[]) => mockSyncSchedulesFromManifest(...args),
}));

import { discoverAndSyncSchedules } from "./impl";

beforeEach(() => {
  vi.clearAllMocks();
  mockSyncSchedulesFromManifest.mockResolvedValue({ added: 1, updated: 0, orphaned: 0 });
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ schedules: [{ id: "daily", cron: "0 9 * * *" }] }),
  }) as unknown as typeof fetch;
});

describe("discoverAndSyncSchedules", () => {
  it("syncs the schedules the manifest returns", async () => {
    const result = await discoverAndSyncSchedules("app_1", "https://app.example.com");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://app.example.com/api/schedules/manifest",
      expect.objectContaining({ method: "GET" })
    );
    expect(result.total).toBe(1);
    expect(mockSyncSchedulesFromManifest).toHaveBeenCalled();
  });
});
