import { requireWorkspaceAdmin } from "./auth-context";
import { checkSeatQuota } from "./billing";
import { listWorkspaceRoles } from "./store";
import { directory } from "./directory";

export type InviteRequest = { emailAddress: string; roleId: string };

export async function POST(request: Request, workspaceId: string): Promise<Response> {
  const { userId } = await requireWorkspaceAdmin(workspaceId);
  const { invitations } = (await request.json()) as { invitations: InviteRequest[] };

  const quota = await checkSeatQuota(workspaceId, invitations.length);
  if (!quota.allowed) return Response.json({ error: "seat limit reached" }, { status: 402 });

  const roleIds = new Set((await listWorkspaceRoles(workspaceId)).map((r) => r.id));
  const created: string[] = [];
  for (const invitation of invitations) {
    if (!roleIds.has(invitation.roleId)) {
      return Response.json({ error: "unknown role" }, { status: 400 });
    }
    const result = await directory.createInvitation({
      workspaceId,
      emailAddress: invitation.emailAddress,
      invitedBy: userId,
      metadata: { workspaceRoleId: invitation.roleId },
    });
    created.push(result.id);
  }
  return Response.json({ success: true, data: { invitationIds: created } });
}
