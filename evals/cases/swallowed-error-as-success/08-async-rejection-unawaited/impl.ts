export type Job = { id: string; payload: Record<string, unknown> };

export class Dispatcher {
  private delivered: Job[] = [];

  async dispatch(job: Job): Promise<void> {
    if (!job.id) throw new Error("job id is required");
    if (Object.keys(job.payload).length === 0) throw new Error("empty payload");
    this.delivered.push(job);
  }

  count(): number {
    return this.delivered.length;
  }
}
