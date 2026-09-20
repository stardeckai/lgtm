import { describe, expect, it, vi } from "vitest";
import { handleReport } from "./impl";

describe("handleReport", () => {
  it("answers an inverted date range with an empty result set", async () => {
    const reporting = { rows: vi.fn().mockResolvedValue([{ day: "2024-01-01", total: 10 }]) };

    const response = await handleReport(reporting, { tenantId: "ten_2", from: "2024-03-01", to: "2024-02-01" });

    expect(response.status).toBe(200);
    expect(response.body.rows).toEqual([]);
  });
});
