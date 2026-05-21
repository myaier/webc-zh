import { existsSync, readdirSync, rmSync, statSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { build } from "rolldown";
import write from "@3-/write";
import ROOT from "./const/ROOT.js";
import resolveDeps from "./importmapDeps.js";

const IMPORTMAP_DIR = join(ROOT, "importmap"),
  subs = existsSync(IMPORTMAP_DIR)
    ? readdirSync(IMPORTMAP_DIR).filter(
        (f) => !f.startsWith(".") && statSync(join(IMPORTMAP_DIR, f)).isDirectory(),
      )
    : [],
  jsList = (dir) =>
    existsSync(dir)
      ? readdirSync(dir).filter(
          (f) => f.endsWith(".js") && !f.startsWith(".") && statSync(join(dir, f)).isFile(),
        )
      : [];

export default (is_build) => {
  const used_files = new Map();
  let outDir = "dist";

  return {
    name: "importmap-pack",
    configResolved: (config) => {
      outDir = config.build.outDir || "dist";
    },
    configureServer: () => {
      subs.forEach((sub) => rmSync(join(ROOT, "public", sub + ".js"), { force: true }));
    },
    buildStart: () => {
      used_files.clear();
      subs.forEach((sub) => {
        used_files.set(sub, new Set());
        if (!is_build) {
          rmSync(join(ROOT, "public", sub + ".js"), { force: true });
        }
      });
    },
    resolveId: (id) => {
      const parts = id.startsWith("/") ? id.slice(1).split("/") : id.split("/"),
        sub = parts[0];

      if (subs.includes(sub)) {
        const name = parts.length > 1 ? parts.slice(1).join("/") : "_.js",
          path = join(IMPORTMAP_DIR, sub, name);

        if (name === "_.js" || (existsSync(path) && statSync(path).isFile())) {
          if (is_build) {
            if (name === "_.js") {
              jsList(join(IMPORTMAP_DIR, sub)).forEach((f) => used_files.get(sub).add(f));
            } else {
              used_files.get(sub).add(name);
            }
            return { id: sub, external: true };
          }
          if (name === "_.js") {
            return "\0importmap-bundle-" + sub + ".js";
          }
          return path;
        }
      }
    },
    load: (id) => {
      const match =
        id.startsWith("\0importmap-bundle-") && id.endsWith(".js") ? id.slice(18, -3) : "";
      if (!is_build && match && subs.includes(match)) {
        const files = jsList(join(IMPORTMAP_DIR, match));
        return {
          code: files.map((f) => 'export * from "/importmap/' + match + "/" + f + '";').join("\n"),
        };
      }
    },
    generateBundle: async () => {
      if (!is_build) return;

      await Promise.all(
        subs.map(async (sub) => {
          const public_file = join(ROOT, "public", sub + ".js"),
            sub_used = used_files.get(sub);
          rmSync(public_file, { force: true });

          if (sub_used && sub_used.size > 0) {
            const all_used = new Set(sub_used);
            for (const file of sub_used) {
              resolveDeps(sub, file, all_used);
            }

            const tmp = join(IMPORTMAP_DIR, ".temp-entry-" + sub + ".js"),
              code = Array.from(all_used)
                .map((f) => 'export * from "./' + sub + "/" + f + '";')
                .join("\n");

            write(tmp, code);

            try {
              await build({
                input: tmp,
                resolve: {
                  alias: {
                    [sub]: join(IMPORTMAP_DIR, sub),
                  },
                },
                output: {
                  file: public_file,
                  format: "esm",
                  minify: true,
                },
              });
              if (existsSync(public_file)) {
                const dist_file = join(ROOT, outDir, sub + ".js");
                copyFileSync(public_file, dist_file);
              }
            } finally {
              rmSync(tmp, { force: true });
            }
          }
        }),
      );
    },
  };
};
