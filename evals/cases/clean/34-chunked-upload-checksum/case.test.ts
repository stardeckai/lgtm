import { describe, expect, it } from "vitest";
import { chunkChecksum, UploadSession } from "./impl";

describe("UploadSession", () => {
  it("refuses a corrupted chunk and assembles the rest in index order", () => {
    const parts = [Buffer.from("alpha"), Buffer.from("beta"), Buffer.from("gamma")];
    const session = new UploadSession(3);

    expect(session.put({ index: 2, data: parts[2]! }, chunkChecksum({ index: 2, data: parts[2]! }))).toBe("stored");
    expect(session.put({ index: 0, data: parts[0]! }, chunkChecksum({ index: 0, data: parts[0]! }))).toBe("stored");
    expect(session.put({ index: 1, data: Buffer.from("beto") }, chunkChecksum({ index: 1, data: parts[1]! }))).toBe(
      "checksum mismatch",
    );
    expect(session.complete()).toEqual({ missing: [1] });

    expect(session.put({ index: 1, data: parts[1]! }, chunkChecksum({ index: 1, data: parts[1]! }))).toBe("stored");
    const done = session.complete();
    expect("body" in done && done.body.toString()).toBe("alphabetagamma");
    expect("digest" in done && done.digest).toBe(
      "c04a9408aace4db24979fa5cd28ad7aa454d7b97a30e9eb561387e7b53c33abc",
    );
  });
});
