import { describe, expect, it } from "vitest";
import { renderEmail, type Notification, type TemplateEngine } from "./impl";

const engine: TemplateEngine = {
  render(template, values) {
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key: string) => {
      const value = values[key];
      if (value === undefined) return "";
      return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    });
  },
};

const notification: Notification = {
  subject: "Welcome {{ name }}",
  bodyTemplate: "Hi {{name}}, your team is {{team}}.",
  values: { name: "<Ada>", team: "R&D" },
};

describe("renderEmail", () => {
  it("escapes interpolated values before they reach the html body", () => {
    expect(renderEmail(engine, notification)).toEqual({
      subject: "Welcome &lt;Ada&gt;",
      html: "<div>Hi &lt;Ada&gt;, your team is R&amp;D.</div>",
    });
  });
});
