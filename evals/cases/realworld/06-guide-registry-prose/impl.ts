export const CHECKOUT_GUIDE = `# Checkout panels

Declare each panel in \`panel.json\` and mirror it in \`src/panels.ts\`; there is no codegen,
so keep the two in sync by hand.

Slugs must be unique across the app and entries must not nest:

    { slug: "till", entry: "/", icon: "shopping-cart" }

\`icon\` is an icon-set name; never use emoji.
`;

export type GuideEntry = { type: "inline"; description: string; content: string };

export const GUIDE_REGISTRY: Record<string, GuideEntry> = {
  checkout: {
    type: "inline",
    description: "Read when the request mentions a till, a staff console or a kiosk that needs its own address.",
    content: CHECKOUT_GUIDE,
  },
};
