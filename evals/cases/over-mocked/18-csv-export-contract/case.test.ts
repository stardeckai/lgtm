import { describe, expect, it, vi } from "vitest";
import { exportCustomers } from "./impl";

describe("exportCustomers", () => {
  it("escapes quotes, commas and newlines so the csv stays parseable", async () => {
    const upload = vi.fn().mockResolvedValue({ url: "https://cdn.example.com/customers.csv" });

    await exportCustomers({ upload }, "org-7", [
      { name: 'Nok "The Chef"', email: "nok@example.com", notes: "likes, commas", totalCents: 12_345 },
      { name: "Ploy", email: "ploy@example.com", notes: "line\nbreak", totalCents: 500 },
    ]);

    expect(upload).toHaveBeenCalledWith(
      "exports/org-7/customers.csv",
      'name,email,notes,total\n"Nok ""The Chef""",nok@example.com,"likes, commas",123.45\nPloy,ploy@example.com,"line\nbreak",5.00',
    );
  });
});
