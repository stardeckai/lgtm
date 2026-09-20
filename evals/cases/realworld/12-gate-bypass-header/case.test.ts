import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSignGateBypass = vi.fn();
vi.mock("./gate", () => ({
  signGateBypass: (...args: unknown[]) => mockSignGateBypass(...args),
}));

import { fetchAppManifest } from "./impl";

beforeEach(() => {
  vi.clearAllMocks();
  process.env.GATE_BYPASS_SECRET = "bypass-secret";
  mockSignGateBypass.mockReturnValue("bypass-token");
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ routes: ["/"] }),
  }) as unknown as typeof fetch;
});

describe("fetchAppManifest", () => {
  it("sends the visibility-gate bypass scoped to the requesting workspace", async () => {
    await fetchAppManifest("app_1", "ws_9", "https://app.example.com");

    const [, init] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.headers["x-gate-bypass"]).toBe("bypass-token");
    expect(init.redirect).toBe("manual");
    expect(mockSignGateBypass).toHaveBeenCalledWith("bypass-secret", "app_1", "manifest:ws_9");
  });
});
