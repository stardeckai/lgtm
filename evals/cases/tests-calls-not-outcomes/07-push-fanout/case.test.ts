import { describe, expect, it, vi } from "vitest";
import { fanoutAlert, type PushGateway } from "./impl";

describe("fanoutAlert", () => {
  it("skips devices that are still muted", async () => {
    const gateway: PushGateway = { send: vi.fn().mockResolvedValue(undefined) };

    await fanoutAlert(
      gateway,
      [
        { token: "t-1", platform: "ios", mutedUntil: null },
        { token: "t-2", platform: "android", mutedUntil: 2_000 },
        { token: "t-3", platform: "android", mutedUntil: 500 },
      ],
      { title: "Outage", body: "Checkout is degraded" },
      1_000,
    );

    expect(gateway.send).toHaveBeenCalled();
  });
});
