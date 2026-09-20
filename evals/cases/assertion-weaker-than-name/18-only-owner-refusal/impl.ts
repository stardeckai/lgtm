export class Forbidden extends Error {
  constructor(readonly actorId: string) {
    super(`actor ${actorId} may not delete this note`);
    this.name = "Forbidden";
  }
}

export type Note = { id: string; ownerId: string; deleted: boolean };

export class Notebook {
  constructor(private readonly notes: Note[]) {}

  delete(noteId: string, actorId: string): void {
    const note = this.notes.find((candidate) => candidate.id === noteId);
    if (!note) throw new Error(`no such note: ${noteId}`);
    if (note.ownerId !== actorId) throw new Forbidden(actorId);
    note.deleted = true;
  }

  get(noteId: string): Note | undefined {
    return this.notes.find((candidate) => candidate.id === noteId);
  }
}
