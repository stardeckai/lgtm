export type Profile = {
  id: string;
  displayName: string;
  timezone: string;
  marketingOptIn: boolean;
};

export type ProfileUpdate = Partial<Omit<Profile, "id">>;

export function applyProfileUpdate(current: Profile, update: ProfileUpdate): Profile {
  const next = { ...current };
  if (update.displayName !== undefined) {
    const trimmed = update.displayName.trim();
    if (trimmed.length === 0) throw new Error("display name cannot be blank");
    next.displayName = trimmed;
  }
  if (update.timezone !== undefined) next.timezone = update.timezone;
  if (update.marketingOptIn !== undefined) next.marketingOptIn = update.marketingOptIn;
  return next;
}
