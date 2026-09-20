export type WidgetConfig = {
  theme: "light" | "dark";
  position: "left" | "right";
  greeting: string;
  showAvatar: boolean;
};

const DEFAULT_CONFIG: WidgetConfig = {
  theme: "light",
  position: "right",
  greeting: "Hi there",
  showAvatar: true,
};

export function withDefaults(partial: Partial<WidgetConfig>): WidgetConfig {
  return { ...DEFAULT_CONFIG, ...partial };
}

export function embedSnippet(partial: Partial<WidgetConfig>): string {
  return `<script data-config='${JSON.stringify(withDefaults(partial))}'></script>`;
}
