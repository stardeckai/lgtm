export type Signup = { email: string; orgName: string; plan: "free" | "pro" };

export interface Provisioner {
  createOrg(name: string, plan: string): Promise<{ id: string }>;
  seedDefaults(orgId: string): Promise<void>;
}

export async function provisionSignup(
  provisioner: Provisioner,
  signup: Signup,
): Promise<{ orgId: string; seatLimit: number }> {
  const org = await provisioner.createOrg(signup.orgName.trim(), signup.plan);
  await provisioner.seedDefaults(org.id);
  return { orgId: org.id, seatLimit: signup.plan === "pro" ? 25 : 3 };
}
