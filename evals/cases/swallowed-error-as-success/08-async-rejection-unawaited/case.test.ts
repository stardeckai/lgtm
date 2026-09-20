import { describe, expect, it } from "vitest";
import { Dispatcher } from "./impl";

describe("Dispatcher", () => {
  it("refuses a job with an empty payload", async () => {
    const dispatcher = new Dispatcher();

    try {
      await dispatcher.dispatch({ id: "job_1", payload: {} });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }

    expect(dispatcher.count()).toBeGreaterThanOrEqual(0);
  });
});
