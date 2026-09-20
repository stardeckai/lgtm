import crypto from "crypto";

export type AuditInput = {
  workspaceId: string;
  actorId: string;
  action: string;
  subjectId: string;
};

export type AuditEnvelope = {
  version: number;
  workspaceId: string;
  actorId: string;
  action: string;
  subjectId: string;
  recordedAt: number;
  eventId: string;
};

export function buildAuditEnvelope(input: AuditInput): AuditEnvelope {
  return {
    version: 2,
    workspaceId: input.workspaceId,
    actorId: input.actorId,
    action: input.action,
    subjectId: input.subjectId,
    recordedAt: Math.floor(Date.now() / 1000),
    eventId: crypto.randomUUID(),
  };
}
