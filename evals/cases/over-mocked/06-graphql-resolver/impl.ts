export type Context = {
  loaders: { projectById: { load(id: string): Promise<{ id: string; orgId: string; name: string } | null> } };
  permissions: { canRead(orgId: string, resource: string): Promise<boolean> };
  db: { listDeployments(projectId: string): Promise<{ id: string; status: string }[]> };
  log: (message: string) => void;
};

export const projectResolver = {
  async project(_: unknown, args: { id: string }, ctx: Context) {
    const project = await ctx.loaders.projectById.load(args.id);
    if (!project) return null;
    if (!(await ctx.permissions.canRead(project.orgId, "project"))) {
      ctx.log(`[projectResolver] denied ${args.id}`);
      throw new Error("forbidden");
    }
    const deployments = await ctx.db.listDeployments(project.id);
    return { ...project, deployments, liveCount: deployments.filter((d) => d.status === "live").length };
  },
};
