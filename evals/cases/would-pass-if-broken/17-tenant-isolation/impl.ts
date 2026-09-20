export type Note = { id: string; tenantId: string; body: string };

export class NoteStore {
  private rows = new Map<string, Note>();

  put(note: Note): void {
    this.rows.set(note.id, note);
  }

  get(tenantId: string, id: string): Note | null {
    const row = this.rows.get(id);
    if (!row || row.tenantId !== tenantId) return null;
    return row;
  }

  list(tenantId: string): Note[] {
    return [...this.rows.values()].filter((row) => row.tenantId === tenantId);
  }
}
