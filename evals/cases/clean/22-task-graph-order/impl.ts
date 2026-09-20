export type Task = { id: string; needs: string[] };

export function runOrder(tasks: Task[]): string[] {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  for (const task of tasks) {
    for (const need of task.needs) {
      if (!byId.has(need)) throw new Error(`${task.id} needs unknown task ${need}`);
    }
  }
  const state = new Map<string, "new" | "visiting" | "done">(tasks.map((t) => [t.id, "new"]));
  const order: string[] = [];

  const visit = (id: string, trail: string[]): void => {
    const status = state.get(id);
    if (status === "done") return;
    if (status === "visiting") throw new Error(`cycle: ${[...trail, id].join(" -> ")}`);
    state.set(id, "visiting");
    for (const need of [...byId.get(id)!.needs].sort()) visit(need, [...trail, id]);
    state.set(id, "done");
    order.push(id);
  };

  for (const task of [...tasks].sort((a, b) => a.id.localeCompare(b.id))) visit(task.id, []);
  return order;
}
