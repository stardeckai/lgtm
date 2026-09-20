import { describe, expect, test } from "vitest";
import { orderResponse, type OrderRow } from "./impl";

describe("orderResponse", () => {
  test("omits the next link on the final page", () => {
    const rows: OrderRow[] = [
      { id: "ord_1", status: "paid", totalCents: 1200, placedAt: "2024-01-01T00:00:00.000Z" },
      { id: "ord_2", status: "paid", totalCents: 3400, placedAt: "2024-01-02T00:00:00.000Z" },
      { id: "ord_3", status: "refunded", totalCents: 900, placedAt: "2024-01-03T00:00:00.000Z" },
    ];

    expect(orderResponse(rows, 2, 2)).toMatchInlineSnapshot(`
      {
        "data": [
          {
            "attributes": {
              "placed_at": "2024-01-03T00:00:00.000Z",
              "status": "refunded",
              "total_cents": 900,
            },
            "id": "ord_3",
            "links": {
              "self": "/v1/orders/ord_3",
            },
            "type": "order",
          },
        ],
        "links": {
          "next": null,
          "prev": "/v1/orders?page=1",
          "self": "/v1/orders?page=2",
        },
        "meta": {
          "page": 2,
          "per_page": 2,
          "total": 3,
          "total_pages": 2,
        },
      }
    `);
  });
});
