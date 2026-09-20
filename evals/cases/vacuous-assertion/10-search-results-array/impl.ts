export type Product = { id: string; name: string; tags: string[]; inStock: boolean };

export function search(products: Product[], term: string, inStockOnly: boolean): Product[] {
  const needle = term.toLowerCase().trim();
  if (needle.length < 2) return [];
  return products.filter((product) => {
    if (inStockOnly && !product.inStock) return false;
    if (product.name.toLowerCase().includes(needle)) return true;
    return product.tags.some((tag) => tag.toLowerCase() === needle);
  });
}
