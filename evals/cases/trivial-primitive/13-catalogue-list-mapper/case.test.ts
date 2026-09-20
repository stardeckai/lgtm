import { describe, expect, it } from "vitest";
import { toCards } from "./impl";

describe("toCards", () => {
  it("maps every catalogue row to a card", () => {
    expect(
      toCards([
        { product_id: "p1", title: "Kettle", vendor_name: "Boilr", image_url: null },
        { product_id: "p2", title: "Toaster", vendor_name: "Crisp", image_url: "https://cdn/x.png" },
      ]),
    ).toEqual([
      { id: "p1", title: "Kettle", vendor: "Boilr", image: null },
      { id: "p2", title: "Toaster", vendor: "Crisp", image: "https://cdn/x.png" },
    ]);
  });
});
