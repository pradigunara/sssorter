import { defineConfig, loadEnv } from "vite";
import autoprefixer from "autoprefixer";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

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
          let result = html;


          const preloadScript = `<script>
(function(){
  var d=localStorage.getItem("darkMode")==="true";
  var p=d?["picSet3","picSet4"]:["picSet1","picSet2"];
  window.__PICSET__=p[Math.random()<.5?0:1];
})();</script>`;

          result = result.replace(
            '<script>\n      window.__SUPABASE_CONFIG__',
            `${preloadScript}\n    <script>\n      window.__SUPABASE_CONFIG__`,
          );

          return result;
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
