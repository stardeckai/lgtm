import { describe, expect, it } from "vitest";
import { envelopeFor } from "./impl";

describe("envelopeFor", () => {
  it("starts a newly created envelope in the queued status", () => {
    const envelope = envelopeFor({ type: "order.paid", aggregateId: "o-3", version: 4 }, 17);

    expect(envelope).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        status: expect.any(String),
        attempts: expect.any(Number),
      }),
    );
  });
});
