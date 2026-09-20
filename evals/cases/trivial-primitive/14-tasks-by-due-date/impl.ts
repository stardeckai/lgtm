export type Task = { id: string; title: string; dueAt: string; status: "todo" | "doing" | "done" };

export function sortByDueDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

export function upcomingColumn(tasks: Task[], limit: number): Task[] {
  return sortByDueDate(tasks.filter((task) => task.status !== "done")).slice(0, limit);
}
