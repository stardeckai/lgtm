import { describe, expect, it } from "vitest";
import { describeCron } from "./impl";

describe("describeCron", () => {
  it("joins two weekday numbers with 'and'", () => {
    expect(describeCron("30 6 * * 1,4")).toMatchInlineSnapshot(`"At 06:30 on Monday and Thursday"`);
    expect(describeCron("0 0 1 * *")).toBe("At 00:00 on day 1 of every month");
  });
});
