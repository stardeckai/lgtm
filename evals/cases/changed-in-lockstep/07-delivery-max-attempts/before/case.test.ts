import { describe, expect, it } from "vitest";
import { recordFailure, type Delivery } from "./impl";

describe("recordFailure", () => {
  it("moves a delivery to the dead letter state on its final attempt", () => {
    const delivery: Delivery = { id: "d1", attempts: 1, status: "failed" };

    expect(recordFailure(delivery).status).toBe("failed");
    expect(recordFailure({ ...delivery, attempts: 2 }).status).toBe("dead");
  });
});
