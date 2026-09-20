export type DeployState = "queued" | "building" | "live" | "failed" | "rolled-back";

export type DeployEvent =
  | { type: "start" }
  | { type: "built" }
  | { type: "error"; message: string }
  | { type: "rollback" };

export class Deploy {
  state: DeployState = "queued";
  readonly history: { at: string; state: DeployState }[] = [];

  constructor(private readonly now: () => Date) {
    this.history.push({ at: this.now().toISOString(), state: "queued" });
  }

  apply(event: DeployEvent): DeployState {
    const next = this.nextState(event);
    if (next !== this.state) {
      this.state = next;
      this.history.push({ at: this.now().toISOString(), state: next });
    }
    return this.state;
  }

  private nextState(event: DeployEvent): DeployState {
    if (event.type === "error") return this.state === "live" ? "live" : "failed";
    if (event.type === "rollback") return this.state === "live" ? "rolled-back" : this.state;
    if (event.type === "start") return this.state === "queued" ? "building" : this.state;
    return this.state === "building" ? "live" : this.state;
  }
}
