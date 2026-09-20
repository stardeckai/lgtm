export type Task = { id: string; runAfterMs: number };

export class TaskBuffer {
  private tasks: Task[] = [];

  schedule(task: Task): void {
    this.tasks.push(task);
  }

  due(nowMs: number): Task[] {
    const ready = this.tasks.filter((t) => t.runAfterMs <= nowMs);
    this.tasks = this.tasks.filter((t) => t.runAfterMs > nowMs);
    return ready.sort((a, b) => a.runAfterMs - b.runAfterMs);
  }
}
