export type Classroom = { room: string; capacity: number; enrolled: string[] };

export function enrol(classroom: Classroom, student: string): Classroom {
  if (classroom.enrolled.includes(student))
    throw new Error(`${student} is already enrolled`);
  if (classroom.enrolled.length >= classroom.capacity)
    throw new Error(`${classroom.room} is full`);
  return { ...classroom, enrolled: [...classroom.enrolled, student] };
}
