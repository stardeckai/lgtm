export type Checkpoint = { stream: string; offset: number; tags: string[]; updatedAt: number };

export function serialize(checkpoint: Checkpoint): string {
  return [
    "v1",
    encodeURIComponent(checkpoint.stream),
    String(checkpoint.offset),
    checkpoint.tags.map(encodeURIComponent).join(","),
    String(checkpoint.updatedAt),
  ].join(";");
}

export function deserialize(text: string): Checkpoint {
  const [version, stream, offset, tags, updatedAt] = text.split(";");
  if (version !== "v1") throw new Error(`unsupported checkpoint version ${version}`);
  return {
    stream: decodeURIComponent(stream ?? ""),
    offset: Number(offset),
    tags: tags ? tags.split(",").map(decodeURIComponent) : [],
    updatedAt: Number(updatedAt),
  };
}

export interface FileSystem {
  read(path: string): Promise<string>;
  write(path: string, contents: string): Promise<void>;
}

export async function saveCheckpoint(fs: FileSystem, path: string, checkpoint: Checkpoint): Promise<void> {
  await fs.write(path, serialize(checkpoint));
}

export async function loadCheckpoint(fs: FileSystem, path: string): Promise<Checkpoint> {
  return deserialize(await fs.read(path));
}
