export type Ticket = {
  id: string;
  queue: string;
  priority: 1 | 2 | 3;
  assigneeId: string | null;
  updatedAt: string;
};

export interface TicketRepository {
  waiting(queue: string, limit: number): Promise<Ticket[]>;
}

export class SqlTicketRepository implements TicketRepository {
  constructor(private readonly rows: Ticket[]) {}
  async waiting(queue: string, limit: number): Promise<Ticket[]> {
    return this.rows
      .filter((row) => row.queue === queue && row.assigneeId === null)
      .sort((a, b) => a.priority - b.priority || Date.parse(a.updatedAt) - Date.parse(b.updatedAt))
      .slice(0, limit);
  }
}

export async function nextForAgent(repo: TicketRepository, queue: string): Promise<string | null> {
  const [head] = await repo.waiting(queue, 1);
  return head?.id ?? null;
}
