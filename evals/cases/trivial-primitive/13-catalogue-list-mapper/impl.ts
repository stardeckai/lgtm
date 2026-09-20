export type CatalogueRow = {
  product_id: string;
  title: string;
  vendor_name: string;
  image_url: string | null;
};

export type CatalogueCard = { id: string; title: string; vendor: string; image: string | null };

export function toCard(row: CatalogueRow): CatalogueCard {
  return { id: row.product_id, title: row.title, vendor: row.vendor_name, image: row.image_url };
}

export function toCards(rows: CatalogueRow[]): CatalogueCard[] {
  return rows.map(toCard);
}
