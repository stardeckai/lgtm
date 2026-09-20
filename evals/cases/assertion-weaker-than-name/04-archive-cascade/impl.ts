export type Project = { id: string; archived: boolean };

export type Task = { id: string; projectId: string; state: "open" | "archived" };

export class Workspace {
  constructor(
    readonly projects: Project[],
    readonly tasks: Task[],
  ) {}

  archiveProject(projectId: string): void {
    const project = this.projects.find((candidate) => candidate.id === projectId);
    if (!project) throw new Error(`no such project: ${projectId}`);
    project.archived = true;
    for (const task of this.tasks) {
      if (task.projectId === projectId) task.state = "archived";
    }
  }
}
