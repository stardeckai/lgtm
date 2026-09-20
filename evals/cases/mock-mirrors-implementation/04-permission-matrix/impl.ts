export type Role = "viewer" | "editor" | "admin";
export type Action = "read" | "write" | "delete" | "invite";

export interface Authorizer {
  allows(role: Role, action: Action): boolean;
}

export const roleMatrix: Authorizer = {
  allows(role, action) {
    if (role === "admin") return true;
    if (role === "editor") return action === "read" || action === "write";
    return action === "read";
  },
};

export type Request = { role: Role; action: Action; resourceId: string };

export function handle(authorizer: Authorizer, request: Request): { status: number; body: string } {
  if (!authorizer.allows(request.role, request.action)) {
    return { status: 403, body: `${request.role} may not ${request.action}` };
  }
  return { status: 200, body: `${request.action} ${request.resourceId}` };
}
