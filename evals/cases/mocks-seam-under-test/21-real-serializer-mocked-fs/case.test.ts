import { describe, expect, it, vi } from "vitest";
import { loadCheckpoint, saveCheckpoint, type Checkpoint, type FileSystem } from "./impl";

describe("checkpoint file", () => {
  it("reads back a checkpoint whose stream name and tags contain separators", async () => {
    const files = new Map<string, string>();
    const fs: FileSystem = {
      write: vi.fn(async (path: string, contents: string) => {
        files.set(path, contents);
      }),
      read: vi.fn(async (path: string) => files.get(path) ?? ""),
    };
    const checkpoint: Checkpoint = {
      stream: "orders;eu",
      offset: 9812,
      tags: ["a,b", "c;d"],
      updatedAt: 1_712_000_000,
    };

    await saveCheckpoint(fs, "/var/state/cp", checkpoint);

    await expect(loadCheckpoint(fs, "/var/state/cp")).resolves.toEqual(checkpoint);
  });
});
