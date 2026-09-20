import { describe, expect, test } from "vitest";
import { buildOpenApiPaths, type Route } from "./impl";

describe("buildOpenApiPaths", () => {
  test("converts express-style parameters into OpenAPI braces", () => {
    const routes: Route[] = [
      { method: "GET", path: "/v1/orders/:orderId", summary: "Fetch an order", auth: true },
      { method: "DELETE", path: "/v1/orders/:orderId", summary: "Cancel an order", auth: true },
      { method: "GET", path: "/v1/health", summary: "Liveness probe", auth: false },
    ];

    expect(buildOpenApiPaths(routes)).toMatchInlineSnapshot(`
      {
        "/v1/health": {
          "get": {
            "operationId": "getvhealth",
            "responses": {
              "200": {
                "description": "OK",
              },
              "401": {
                "description": "Unauthorized",
              },
            },
            "security": [],
            "summary": "Liveness probe",
          },
        },
        "/v1/orders/{orderId}": {
          "delete": {
            "operationId": "deletevordersorderId",
            "responses": {
              "200": {
                "description": "OK",
              },
              "401": {
                "description": "Unauthorized",
              },
            },
            "security": [
              {
                "bearerAuth": [],
              },
            ],
            "summary": "Cancel an order",
          },
          "get": {
            "operationId": "getvordersorderId",
            "responses": {
              "200": {
                "description": "OK",
              },
              "401": {
                "description": "Unauthorized",
              },
            },
            "security": [
              {
                "bearerAuth": [],
              },
            ],
            "summary": "Fetch an order",
          },
        },
      }
    `);
  });
});
