import { readFileSync } from "node:fs";
import { join } from "node:path";

function connectSrcFromIndexHtml() {
  const html = readFileSync(join(process.cwd(), "index.html"), "utf8");
  const match = html.match(/connect-src\s+([^;]+)/);
  return match?.[1] ?? "";
}

function exportFontHrefFromSource() {
  const src = readFileSync(join(process.cwd(), "assets/lib/image-export.js"), "utf8");
  const match = src.match(/const FONT_HREF =\s*\n?\s*"([^"]+)"/);
  return match?.[1] ?? "";
}

describe("image export CSP", () => {
  test("allows fetch to Google Fonts hosts for html-to-image embedding", () => {
    const connectSrc = connectSrcFromIndexHtml();
    expect(connectSrc).toContain("https://fonts.googleapis.com");
    expect(connectSrc).toContain("https://fonts.gstatic.com");
  });
});

describe("image export fonts", () => {
  test("includes Caveat for Case Board title export", () => {
    const fontHref = exportFontHrefFromSource();
    expect(fontHref).toContain("family=Caveat");
    expect(fontHref).toContain("wght@500;600;700");
  });
});