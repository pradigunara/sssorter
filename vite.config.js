import { defineConfig, loadEnv } from "vite";
import autoprefixer from "autoprefixer";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { readFileSync } from "node:fs";

const { memberData } = await import(
  pathToFileURL(resolve(process.cwd(), "assets/member-data.js")).href
);

function findMemberBySNumber(sNumber) {
  for (const member of Object.values(memberData)) {
    if (member?.sNumber === sNumber) return member;
  }
  throw new Error(`No member found with sNumber "${sNumber}" in member-data.js`);
}

const s1Member = findMemberBySNumber("S1");
const s24Member = findMemberBySNumber("S24");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  const url = env.VITE_SUPABASE_URL || "";
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY || "";

  return {
    root: ".",
    plugins: [
      {
        name: "inject-supabase-config",
        transformIndexHtml(html) {
          return html
            .replace("__SUPABASE_URL__", url)
            .replace("__SUPABASE_KEY__", key);
        },
      },
      {
        name: "inject-member-photocards",
        transformIndexHtml(html) {
          return html
            .replace("__S1_PICSET1_URL__", s1Member.picSet1)
            .replace("__S24_PICSET1_URL__", s24Member.picSet1);
        },
      },
      {
        name: "inline-core-css",
        apply: "build",
        transformIndexHtml(html) {
          // Read core CSS files and concatenate them (without @import)
          const cssDir = resolve(process.cwd(), "assets/css");
          const coreFiles = ["base.css", "layout.css", "cards.css", "auth.css", "theme.css"];
          const coreCss = coreFiles
            .map((f) => readFileSync(resolve(cssDir, f), "utf-8"))
            .join("\n");

          // Match Vite's processed CSS link and replace with inlined core + deferred full
          return html.replace(
            /(<link rel="stylesheet" crossorigin href=")(\/assets\/main-[^"]+\.css)(">)/,
            `<style>${coreCss}</style>\n    <link rel="preload" href="$2" as="style" onload="this.onload=null;this.rel='stylesheet'" />\n    <noscript><link rel="stylesheet" href="$2" /></noscript>`,
          );
        },
      },
    ],
    build: {
      outDir: "dist",
      rollupOptions: {
        input: {
          main: "index.html",
        },
      },
    },
    css: {
      postcss: {
        plugins: [autoprefixer],
      },
    },
  };
});
