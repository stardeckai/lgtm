export type Dish = { id: string; name: string; ingredients: string[] };

const ALLERGEN_INGREDIENTS: Record<string, string[]> = {
  dairy: ["butter", "cream", "cheese"],
  nuts: ["almond", "walnut", "pistachio"],
  shellfish: ["prawn", "crab"],
};

export class MenuBoard {
  private dishes: Dish[] = [];

  add(dish: Dish): void {
    if (this.dishes.some((d) => d.id === dish.id))
      throw new Error(`duplicate dish ${dish.id}`);
    this.dishes.push(dish);
  }

  all(): Dish[] {
    return [...this.dishes];
  }
}

export function safeDishIds(board: MenuBoard, avoid: string[]): string[] {
  const banned = new Set(avoid.flatMap((a) => ALLERGEN_INGREDIENTS[a] ?? []));
  return board
    .all()
    .filter((dish) => dish.ingredients.every((i) => !banned.has(i)))
    .map((dish) => dish.id);
}
