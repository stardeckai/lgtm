import { describe, expect, it } from "vitest";
import { handle, IdempotencyStore } from "./impl";

describe("handle", () => {
  it("replays the stored response for a repeat and refuses the same key with a different body", () => {
    const store = new IdempotencyStore();
    let runs = 0;
    const create = () => {
      runs += 1;
      return { status: 201, body: `{"id":"ord_${runs}"}` };
    };
    const request = { key: "idem-1", method: "post", path: "/orders", body: '{"sku":"A"}' };

    const first = handle(store, request, create);
    const replay = handle(store, request, create);
    const conflict = handle(store, { ...request, body: '{"sku":"B"}' }, create);

    expect(first).toEqual({ status: 201, body: '{"id":"ord_1"}' });
    expect(replay).toEqual(first);
    expect(conflict).toEqual({ status: 422, body: "key reused with a different request" });
    expect(runs).toBe(1);
  });
});
