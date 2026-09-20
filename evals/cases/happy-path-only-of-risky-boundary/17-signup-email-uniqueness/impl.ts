export type User = { id: string; email: string };

export class UserDirectory {
  private users: User[] = [];

  register(email: string): User {
    const normalised = email.trim().toLowerCase();
    if (!normalised.includes("@")) throw new Error("invalid email");
    if (this.users.some((user) => user.email === normalised)) {
      throw new Error("email already registered");
    }
    const user = { id: `usr_${this.users.length + 1}`, email: normalised };
    this.users.push(user);
    return user;
  }

  count(): number {
    return this.users.length;
  }
}
