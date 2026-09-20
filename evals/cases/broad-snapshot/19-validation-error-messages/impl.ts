export type Signup = { email: string; password: string; age: number };

export function validateSignup(input: Signup): string[] {
  const errors: string[] = [];
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.email)) errors.push("email: must be a valid address");
  if (input.password.length < 12) errors.push("password: must be at least 12 characters");
  if (!/\d/.test(input.password)) errors.push("password: must contain a digit");
  if (input.age < 16) errors.push("age: must be 16 or older");
  return errors;
}
