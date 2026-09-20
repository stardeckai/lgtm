export class CatalogError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly code: string,
  ) {
    super(message);
    this.name = "CatalogError";
  }
}

export class Catalog {
  private skus = new Set<string>();

  add(sku: string, priceCents: number): void {
    if (priceCents <= 0) {
      throw new CatalogError("price must be positive", 422, "invalid_price");
    }
    if (this.skus.has(sku)) {
      throw new CatalogError(`sku ${sku} already exists`, 409, "duplicate_sku");
    }
    this.skus.add(sku);
  }
}
