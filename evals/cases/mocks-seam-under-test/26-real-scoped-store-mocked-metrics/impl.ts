export type Note = { id: string; workspaceId: string; authorId: string; text: string };

export class NoteStore {
  private readonly rows: Note[] = [];
  insert(note: Note): void {
    this.rows.push(note);
  }
  list(scope: { workspaceId: string; authorId?: string }): Note[] {
    return this.rows.filter(
      (row) =>
        row.workspaceId === scope.workspaceId &&
        (scope.authorId === undefined || row.authorId === scope.authorId),
    );
  }
}

export interface Metrics {
  count(name: string, value: number, tags: Record<string, string>): void;
}

export function visibleNotes(
  store: NoteStore,
  metrics: Metrics,
  workspaceId: string,
  viewerId: string,
  isAdmin: boolean,
): Note[] {
  const notes = store.list(isAdmin ? { workspaceId } : { workspaceId, authorId: viewerId });
  metrics.count("notes.listed", notes.length, { workspaceId });
  return notes;
}
