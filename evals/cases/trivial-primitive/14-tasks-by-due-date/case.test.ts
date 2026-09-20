import { describe, expect, it } from "vitest";
import { sortByDueDate, type Task } from "./impl";

describe("sortByDueDate", () => {
  it("puts the earliest due date first", () => {
    const tasks: Task[] = [
      { id: "t1", title: "Ship", dueAt: "2024-05-10", status: "todo" },
      { id: "t2", title: "Draft", dueAt: "2024-05-02", status: "doing" },
      { id: "t3", title: "Review", dueAt: "2024-05-07", status: "todo" },
    ];

    expect(sortByDueDate(tasks).map((task) => task.id)).toEqual(["t2", "t3", "t1"]);
  });
});
