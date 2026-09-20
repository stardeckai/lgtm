export type Theme = "light" | "dark" | "system";

const KEY = "ui.theme";

export function readTheme(storage: Storage): Theme {
  const raw = storage.getItem(KEY);
  return raw === "light" || raw === "dark" ? raw : "system";
}

export function writeTheme(storage: Storage, theme: Theme): void {
  if (theme === "system") storage.removeItem(KEY);
  else storage.setItem(KEY, theme);
}

export function cycleTheme(storage: Storage): Theme {
  const order: Theme[] = ["system", "light", "dark"];
  const current = readTheme(storage);
  const next = order[(order.indexOf(current) + 1) % order.length]!;
  writeTheme(storage, next);
  return next;
}
