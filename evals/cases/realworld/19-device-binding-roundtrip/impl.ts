export class BindingError extends Error {
  constructor(
    message: string,
    public readonly code: "BINDING_NOT_FOUND" | "PERIPHERAL_NOT_GRANTED" | "ALIAS_TAKEN"
  ) {
    super(message);
    this.name = "BindingError";
  }
}

export type Binding = { alias: string; peripheralId: string };

export class DeviceRegistry {
  constructor(private readonly granted: string[]) {}
  private readonly bindings = new Map<string, Binding>();

  pair(alias: string, peripheralId: string): Binding {
    if (!this.granted.includes(peripheralId)) {
      throw new BindingError(`${peripheralId} is not granted to this app`, "PERIPHERAL_NOT_GRANTED");
    }
    if (this.bindings.has(alias)) throw new BindingError(`${alias} is taken`, "ALIAS_TAKEN");
    const binding = { alias, peripheralId };
    this.bindings.set(alias, binding);
    return binding;
  }

  listBindings(): Binding[] {
    return [...this.bindings.values()].sort((a, b) => a.alias.localeCompare(b.alias));
  }

  getBinding(alias: string): Binding {
    const binding = this.bindings.get(alias);
    if (!binding) throw new BindingError(`${alias} is not paired`, "BINDING_NOT_FOUND");
    return binding;
  }

  unpair(alias: string): void {
    if (!this.bindings.delete(alias)) {
      throw new BindingError(`${alias} is not paired`, "BINDING_NOT_FOUND");
    }
  }
}
