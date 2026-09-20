export type Job = { kind: "email" | "sms"; to: string; attempt: number };

export function encodeJob(job: Job): string {
  return JSON.stringify([job.kind, job.to, job.attempt]);
}

export function decodeJob(raw: string): Job {
  const [kind, to, attempt] = JSON.parse(raw) as [Job["kind"], string, number];
  return { kind, to, attempt };
}

export class Queue {
  private items: string[] = [];
  private seen = new Set<string>();

  enqueue(job: Job): boolean {
    const raw = encodeJob(job);
    if (this.seen.has(raw)) return false;
    this.seen.add(raw);
    this.items.push(raw);
    return true;
  }

  drain(): Job[] {
    return this.items.splice(0).map(decodeJob);
  }
}
