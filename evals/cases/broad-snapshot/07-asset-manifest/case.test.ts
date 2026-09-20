import { describe, expect, it } from "vitest";
import { buildManifest, type Asset } from "./impl";

describe("buildManifest", () => {
  it("puts the content hash before the file extension", () => {
    const assets: Asset[] = [
      { name: "app.js", contents: "console.log('app')", entry: true },
      { name: "vendor.js", contents: "/* vendor bundle */", entry: false },
      { name: "styles.css", contents: ".a{color:red}", entry: false },
      { name: "worker.js", contents: "self.onmessage = () => {}", entry: true },
    ];

    expect(buildManifest(assets)).toMatchSnapshot();
  });
});
