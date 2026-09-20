export type Comment = { id: string; authorId: string; body: string; deleted: boolean };

export class Thread {
  constructor(private readonly comments: Comment[]) {}

  delete(commentId: string, actorId: string, actorIsModerator: boolean): boolean {
    const comment = this.comments.find((candidate) => candidate.id === commentId);
    if (!comment) return false;
    if (comment.authorId !== actorId && !actorIsModerator) return false;
    comment.deleted = true;
    return true;
  }

  find(commentId: string): Comment | undefined {
    return this.comments.find((candidate) => candidate.id === commentId);
  }
}
