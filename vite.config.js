import { defineConfig, loadEnv } from "vite";
import autoprefixer from "autoprefixer";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

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
