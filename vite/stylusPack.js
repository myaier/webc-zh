import { readdirSync } from "node:fs";
import { join } from "node:path";
import stylus from "stylus";
import { transform } from "lightningcss";
import read from "@3-/read";
import write from "@3-/write";
import ROOT from "./const/ROOT.js";

const STYL_DIR = join(ROOT, "styl"),
  OUT_FILE = join(ROOT, "public/_.css"),
  compileStylus = (is_build) => {
    const files = readdirSync(STYL_DIR)
      .filter((file) => file.endsWith(".styl"))
      .sort();
    let css = files
      .map((file) => {
        const file_path = join(STYL_DIR, file),
          content = read(file_path);
        return stylus(content).set("filename", file_path).render();
      })
      .join("\n");

    if (is_build) {
      const { code } = transform({
        filename: "_.css",
        code: Buffer.from(css),
        minify: true,
        sourceMap: false,
      });
      css = code.toString();
    }

    write(OUT_FILE, css);
  };

export default (is_build) => ({
  name: "stylus-pack",
  buildStart: () => {
    compileStylus(is_build);
  },
  configureServer: (server) => {
    server.watcher.add(STYL_DIR);
    server.watcher.on("all", (event, file) => {
      if (file.endsWith(".styl")) {
        compileStylus(is_build);
        server.ws.send({ type: "full-reload" });
      }
    });
  },
});
