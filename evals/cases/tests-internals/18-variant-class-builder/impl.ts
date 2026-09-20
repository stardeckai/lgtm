export type ButtonVariant = "primary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground",
  ghost: "bg-transparent text-foreground",
  danger: "bg-destructive text-destructive-foreground",
};

const SIZE: Record<ButtonSize, string> = { sm: "h-8 px-2", md: "h-10 px-4" };

/** later classes win for the same utility prefix */
export function buttonClass(
  variant: ButtonVariant,
  size: ButtonSize,
  overrides = "",
): string {
  const parts = `${VARIANT[variant]} ${SIZE[size]} cursor-pointer ${overrides}`.trim().split(/\s+/);
  const byPrefix = new Map<string, string>();
  for (const part of parts) {
    const prefix = part.slice(0, part.lastIndexOf("-") + 1) || part;
    byPrefix.set(prefix, part);
  }
  return [...byPrefix.values()].join(" ");
}
