import { describe, expect, it, vi } from "vitest";
import { siteAlert, type Forecast } from "./impl";

const forecast: Forecast = {
  hourly: vi.fn().mockResolvedValue([
    { hour: 6, windKph: 41, rainMm: 2 },
    { hour: 9, windKph: 64, rainMm: 1 },
    { hour: 14, windKph: 52, rainMm: 18 },
    { hour: 20, windKph: 33, rainMm: 0 },
  ]),
};

describe("siteAlert", () => {
  it("escalates to a warning when both wind and rain thresholds are crossed", async () => {
    await expect(siteAlert(forecast, "st-12")).resolves.toEqual({
      level: "warning",
      reasons: ["wind", "rain"],
      fromHour: 9,
    });
  });
});
