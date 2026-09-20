export type Snapshot = { version: 2; cursor: string; seen: string[]; updatedAt: number };

export interface Codec {
  encode(snapshot: Snapshot): string;
  decode(text: string): Snapshot;
}

export const compactCodec: Codec = {
  encode(snapshot) {
    return [snapshot.version, snapshot.cursor, snapshot.seen.join("|"), snapshot.updatedAt].join("~");
  },
  decode(text) {
    const [version, cursor, seen, updatedAt] = text.split("~");
    return {
      version: Number(version) as 2,
      cursor: cursor ?? "",
      seen: seen ? seen.split("|") : [],
      updatedAt: Number(updatedAt),
    };
  },
};

export function resume(codec: Codec, stored: string): { cursor: string; skip: Set<string> } {
  const snapshot = codec.decode(stored);
  return { cursor: snapshot.cursor, skip: new Set(snapshot.seen) };
}
