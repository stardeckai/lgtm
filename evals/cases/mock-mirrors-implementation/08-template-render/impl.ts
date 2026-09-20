export interface TemplateEngine {
  render(template: string, values: Record<string, string>): string;
}

export const mustacheLite: TemplateEngine = {
  render(template, values) {
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key: string) => {
      const value = values[key];
      if (value === undefined) return "";
      return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    });
  },
};

export type Notification = { subject: string; bodyTemplate: string; values: Record<string, string> };

export function renderEmail(engine: TemplateEngine, notification: Notification): { subject: string; html: string } {
  return {
    subject: engine.render(notification.subject, notification.values),
    html: `<div>${engine.render(notification.bodyTemplate, notification.values)}</div>`,
  };
}
