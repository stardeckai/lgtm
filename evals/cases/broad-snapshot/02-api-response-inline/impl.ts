export type OrderRow = { id: string; status: string; totalCents: number; placedAt: string };

export function orderResponse(rows: OrderRow[], page: number, perPage: number) {
  const start = (page - 1) * perPage;
  const slice = rows.slice(start, start + perPage);
  return {
    data: slice.map((row) => ({
      id: row.id,
      type: "order",
      attributes: { status: row.status, total_cents: row.totalCents, placed_at: row.placedAt },
      links: { self: `/v1/orders/${row.id}` },
    })),
    meta: { page, per_page: perPage, total: rows.length, total_pages: Math.ceil(rows.length / perPage) },
    links: {
      self: `/v1/orders?page=${page}`,
      next: start + perPage < rows.length ? `/v1/orders?page=${page + 1}` : null,
      prev: page > 1 ? `/v1/orders?page=${page - 1}` : null,
    },
  };
}
