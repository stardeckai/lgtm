export type Member = {
  id: string;
  displayName: string;
  status: "invited" | "active" | "suspended";
  invitedAt: string;
  acceptedAt: string | null;
};

export function parseMember(row: Record<string, unknown>): Member {
  const status = row.status;
  if (status !== "invited" && status !== "active" && status !== "suspended") {
    throw new Error("unknown membership status");
  }
  if (typeof row.invitedAt !== "string") throw new Error("member invitedAt missing");
  if (status === "active" && typeof row.acceptedAt !== "string") {
    throw new Error("an active member must have accepted their invite");
  }
  return {
    id: String(row.id),
    displayName: typeof row.displayName === "string" ? row.displayName : String(row.id),
    status,
    invitedAt: row.invitedAt,
    acceptedAt: typeof row.acceptedAt === "string" ? row.acceptedAt : null,
  };
}

export function membershipSummary(member: Member): string {
  if (member.status !== "active") return `${member.displayName} (${member.status})`;
  const joined = member.acceptedAt ?? member.invitedAt;
  return `${member.displayName} joined ${joined.slice(0, 10)}`;
}
