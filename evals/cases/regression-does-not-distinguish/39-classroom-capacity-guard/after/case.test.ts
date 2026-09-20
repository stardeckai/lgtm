import { describe, expect, it } from "vitest";
import { enrol, type Classroom } from "./impl";

describe("enrol", () => {
  it("turns away the student who would take the room past its capacity", () => {
    let classroom: Classroom = { room: "lab-2", capacity: 2, enrolled: [] };

    classroom = enrol(classroom, "ada");
    classroom = enrol(classroom, "bo");

    expect(classroom.enrolled).toEqual(["ada", "bo"]);
    expect(() => enrol(classroom, "cai")).toThrow("lab-2 is full");
  });
});
