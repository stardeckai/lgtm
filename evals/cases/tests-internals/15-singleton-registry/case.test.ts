import { describe, expect, it, vi } from "vitest";
import { MessengerRegistry, type Transport } from "./impl";

describe("MessengerRegistry", () => {
  it("routes a message to the transport registered for its channel", async () => {
    const registry = MessengerRegistry.shared();
    const transport: Transport = { deliver: vi.fn().mockResolvedValue(undefined) };

    registry.register("line", transport);

    expect((registry as any).transports.get("line")).toBe(transport);
    expect((MessengerRegistry as any).instance).toBe(registry);
  });
});
