import { describe, expect, it } from "vitest";
import { translate, type Catalog } from "./impl";

describe("translate", () => {
  it("prefers the most specific locale and falls back through the region to english", () => {
    const catalog: Catalog = {
      "pt-BR": { greeting: "Oi" },
      pt: { greeting: "Olá", farewell: "Adeus" },
      en: { greeting: "Hello", farewell: "Bye", legal: "Terms" },
    };

    expect(translate(catalog, "pt-BR", "greeting")).toEqual({ text: "Oi", from: "pt-BR" });
    expect(translate(catalog, "pt-BR", "farewell")).toEqual({ text: "Adeus", from: "pt" });
    expect(translate(catalog, "pt_BR", "legal")).toEqual({ text: "Terms", from: "en" });
    expect(translate(catalog, "fr-CA", "greeting")).toEqual({ text: "Hello", from: "en" });
    expect(translate(catalog, "pt-BR", "missing")).toBeNull();
  });
});
