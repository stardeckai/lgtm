import { describe, expect, it } from "vitest";
import { runOrder, type Task } from "./impl";

describe("runOrder", () => {
  it("schedules every dependency before its dependant and names the tasks in a cycle", () => {
    const tasks: Task[] = [
      { id: "deploy", needs: ["build", "migrate"] },
      { id: "build", needs: ["install"] },
      { id: "migrate", needs: ["install"] },
      { id: "install", needs: [] },
    ];

    expect(runOrder(tasks)).toEqual(["install", "build", "migrate", "deploy"]);
    expect(() =>
      runOrder([
        { id: "a", needs: ["b"] },
        { id: "b", needs: ["a"] },
      ]),
    ).toThrow(/cycle: a -> b -> a/);
    expect(() => runOrder([{ id: "a", needs: ["ghost"] }])).toThrow(/unknown task ghost/);
  });
});
