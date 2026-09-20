import { describe, expect, it } from "vitest";
import { BindingError, DeviceRegistry } from "./impl";

describe("DeviceRegistry", () => {
  it("pairs an alias, serves it back, and refuses it again once unpaired", () => {
    const registry = new DeviceRegistry(["printer-a", "printer-b"]);

    registry.pair("counter-1", "printer-a");
    expect(registry.listBindings()).toEqual([{ alias: "counter-1", peripheralId: "printer-a" }]);
    expect(registry.getBinding("counter-1")).toEqual({ alias: "counter-1", peripheralId: "printer-a" });

    expect(() => registry.pair("counter-1", "printer-b")).toThrow(
      expect.objectContaining({ code: "ALIAS_TAKEN" })
    );
    expect(registry.getBinding("counter-1").peripheralId).toBe("printer-a");

    registry.unpair("counter-1");
    expect(registry.listBindings()).toEqual([]);

    let thrown: unknown;
    try {
      registry.getBinding("counter-1");
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(BindingError);
    expect((thrown as BindingError).code).toBe("BINDING_NOT_FOUND");
  });
});
