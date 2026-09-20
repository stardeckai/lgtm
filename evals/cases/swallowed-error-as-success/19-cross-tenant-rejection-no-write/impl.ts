export class AuthorizationError extends Error {
  constructor(readonly code: "TENANT_MISMATCH" | "ROLE_TOO_LOW") {
    super(code);
    this.name = "AuthorizationError";
  }
}

export type Actor = { id: string; tenantId: string; role: "member" | "admin" };
export type Project = { id: string; tenantId: string; name: string };

export class ProjectService {
  constructor(private readonly projects: Map<string, Project>) {}

  rename(actor: Actor, projectId: string, name: string): Project {
    const project = this.projects.get(projectId);
    if (!project) throw new Error("not_found");
    if (project.tenantId !== actor.tenantId) throw new AuthorizationError("TENANT_MISMATCH");
    if (actor.role !== "admin") throw new AuthorizationError("ROLE_TOO_LOW");
    const renamed = { ...project, name };
    this.projects.set(projectId, renamed);
    return renamed;
  }
}
