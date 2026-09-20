export type Member = { userId: string; role: "viewer" | "editor" | "admin" };

export type Document = { id: string; ownerId: string; lockedBy: string | null };

export function canEdit(doc: Document, member: Member): boolean {
  if (doc.lockedBy !== null && doc.lockedBy !== member.userId) return false;
  if (member.userId === doc.ownerId) return true;
  if (member.role === "admin") return true;
  return member.role === "editor";
}
