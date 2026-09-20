import { describe, expect, it } from "vitest";
import { MenuBoard, safeDishIds } from "./impl";

describe("safeDishIds", () => {
  it("hides every dish carrying an ingredient behind an avoided allergen", () => {
    const board = new MenuBoard();
    board.add({
      id: "d1",
      name: "Tomato soup",
      ingredients: ["tomato", "basil"],
    });
    board.add({
      id: "d2",
      name: "Gratin",
      ingredients: ["potato", "cream", "cheese"],
    });
    board.add({
      id: "d3",
      name: "Prawn salad",
      ingredients: ["prawn", "lemon"],
    });
    board.add({
      id: "d4",
      name: "Almond cake",
      ingredients: ["almond", "sugar"],
    });

    expect(safeDishIds(board, ["dairy"])).toEqual(["d1", "d3", "d4"]);
    expect(safeDishIds(board, ["dairy", "nuts", "shellfish"])).toEqual(["d1"]);
    expect(safeDishIds(board, [])).toEqual(["d1", "d2", "d3", "d4"]);
  });
});
