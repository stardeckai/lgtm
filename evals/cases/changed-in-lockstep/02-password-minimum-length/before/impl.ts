export type PasswordProblem = "too short" | "needs a digit" | "needs a letter";

export function checkPassword(password: string): PasswordProblem[] {
  const problems: PasswordProblem[] = [];
  if (password.length < 12) problems.push("too short");
  if (!/[0-9]/.test(password)) problems.push("needs a digit");
  if (!/[a-z]/i.test(password)) problems.push("needs a letter");
  return problems;
}
