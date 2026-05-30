import { defineConfig, loadEnv } from "vite";
import autoprefixer from "autoprefixer";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  const url = env.VITE_SUPABASE_URL || "";
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY || "";

  console.log(`loadEnv: VITE_SUPABASE_URL=${url || "NOT SET"}`);

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
