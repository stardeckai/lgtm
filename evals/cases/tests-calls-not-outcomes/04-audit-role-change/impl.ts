export type Role = "viewer" | "editor" | "admin";

export interface AuditSink {
  record(event: { action: string; actorId: string; targetId: string; from: Role; to: Role }): void;
}

export interface MembershipStore {
  roleOf(userId: string): Role;
  setRole(userId: string, role: Role): void;
}

export function changeRole(
  store: MembershipStore,
  audit: AuditSink,
  actorId: string,
  targetId: string,
  next: Role,
): void {
  if (store.roleOf(actorId) !== "admin") throw new Error("forbidden");
  const from = store.roleOf(targetId);
  if (from === next) return;
  store.setRole(targetId, next);
  audit.record({ action: "role.changed", actorId, targetId, from, to: next });
}
