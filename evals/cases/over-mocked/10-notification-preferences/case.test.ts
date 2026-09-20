import { describe, expect, it, vi } from "vitest";
import { notify } from "./impl";

vi.mock("./preference-store", () => ({ preferenceStore: { get: vi.fn().mockResolvedValue(null) } }));
vi.mock("./templates", () => ({ renderTemplate: vi.fn().mockReturnValue("rendered body") }));
vi.mock("./channel-registry", () => ({
  channelRegistry: { get: vi.fn().mockReturnValue({ send: vi.fn().mockResolvedValue(undefined) }) },
}));

describe("notify", () => {
  it("falls back to the default channels when the user has no preference", async () => {
    const delivered = await notify({ kind: "deploy.failed", userId: "u-1", data: { app: "tracker" } });

    expect(delivered).toEqual(["email", "line"]);
  });
});
