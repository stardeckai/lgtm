export type JobEnvelope = { id: string; type: string; payload: string; attempts: number };

export interface Queue {
  publish(envelope: JobEnvelope): Promise<void>;
  reserve(): Promise<JobEnvelope | null>;
}

export async function enqueueExport(queue: Queue, orgId: string, format: string): Promise<string> {
  const envelope: JobEnvelope = {
    id: `job_${orgId}_${format}`,
    type: "export.requested",
    payload: JSON.stringify({ orgId, format }),
    attempts: 0,
  };
  await queue.publish(envelope);
  return envelope.id;
}

export async function runNextExport(
  queue: Queue,
  render: (orgId: string, format: string) => string,
): Promise<string | null> {
  const envelope = await queue.reserve();
  if (!envelope) return null;
  const { orgId, format } = JSON.parse(envelope.payload) as { orgId: string; format: string };
  return render(orgId, format);
}
