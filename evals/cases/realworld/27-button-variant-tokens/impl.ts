export const buttonVariantMap = {
  variant: {
    solid: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-transparent hover:bg-muted",
    ghost: "bg-transparent hover:bg-muted",
    subtle: "bg-muted text-muted-foreground hover:bg-muted/80",
  },
  size: {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    touch: "h-12 px-5 text-xs font-bold",
  },
} as const;

const BASE = "inline-flex items-center justify-center rounded-md text-sm font-medium";

export type ButtonOptions = {
  variant?: keyof typeof buttonVariantMap.variant;
  size?: keyof typeof buttonVariantMap.size;
};

export function buttonVariants({ variant = "solid", size = "md" }: ButtonOptions = {}): string {
  return [BASE, buttonVariantMap.variant[variant], buttonVariantMap.size[size]].join(" ");
}
