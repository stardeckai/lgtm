import { describe, expect, it } from "vitest";
import { toCsv, type Contact } from "./impl";

describe("toCsv", () => {
  it("doubles an embedded quote inside a quoted cell", () => {
    const contacts: Contact[] = [
      {
        id: "c_1",
        firstName: "Jo",
        lastName: "Park",
        company: "Park & Sons, Ltd",
        title: 'Head of "Special" Projects',
        email: "jo@park.example",
        phone: "+44 20 7000 0000",
        city: "London",
        country: "GB",
        notes: "Prefers email\nno calls",
      },
      {
        id: "c_2",
        firstName: "Rex",
        lastName: "Bell",
        company: "Bellworks",
        title: "CTO",
        email: "rex@bellworks.example",
        phone: "+1 415 555 0100",
        city: "Oakland",
        country: "US",
        notes: "",
      },
    ];

    expect(toCsv(contacts)).toMatchSnapshot();
  });
});
