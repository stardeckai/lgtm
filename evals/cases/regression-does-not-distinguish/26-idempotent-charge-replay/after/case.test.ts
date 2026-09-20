import { describe, expect, it } from "vitest";
import { ChargeBook } from "./impl";

describe("ChargeBook", () => {
  it("returns the original charge when the same idempotency key comes back", () => {
    const book = new ChargeBook();

    const first = book.charge("key-1", 4200);
    const replay = book.charge("key-1", 4200);

    expect(replay).toEqual(first);
    expect(book.all()).toHaveLength(1);
  });
});
