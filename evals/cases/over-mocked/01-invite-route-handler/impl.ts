import { requireActingOrgContext } from "./auth-context";
import { db } from "./db";
import { sendInviteEmail } from "./mailer";
import { parseInvite } from "./schema";

export async function POST(request: Request): Promise<Response> {
  const { userId, effectiveOrgId } = await requireActingOrgContext();
  const parsed = parseInvite(await request.json());
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  const existing = await db.findMember(effectiveOrgId, parsed.value.email);
  if (existing) return Response.json({ error: "already a member" }, { status: 409 });

  const invite = await db.createInvite({
    orgId: effectiveOrgId,
    email: parsed.value.email,
    role: parsed.value.role,
    invitedBy: userId,
  });
  await sendInviteEmail(parsed.value.email, invite.token);
  return Response.json({ success: true, data: { id: invite.id } });
}
