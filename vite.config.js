import { defineConfig } from "vite";
import ENTRIES from "./vite/const/ENTRIES.js";
import plugins from "./vite/plugins.js";

const ROOT = import.meta.dirname;

export default defineConfig(({ command }) => {
  const is_build = command == "build";
  return {
    base: "./",
    resolve: {
      alias: {
        "~/": ROOT,
      },
    },
    server: {
      port: 5180,
    },
    plugins: [
      {
        name: "spa-history-fallback",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url.split("?")[0];
            if (
              req.method == "GET" &&
              url != "/" &&
              !url.includes(".") &&
              req.headers.accept?.includes("text/html")
            ) {
              const query = req.url.split("?")[1];
              req.url = "/Index.html" + (query ? "?" + query : "");
            }
            next();
          });
        },
      },
      ...plugins(is_build),
    ],
    build: {
      rollupOptions: {
        input: Object.keys(ENTRIES),
      },
    },
  };
});
