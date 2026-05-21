import { readdirSync, existsSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import write from "@3-/write";
import ROOT from "./const/ROOT.js";

const COM_DIR = join(ROOT, "com"),
  GEN_DIR = join(ROOT, "gen/com"),
  compileDocs = (ctx) => {
    mkdirSync(GEN_DIR, { recursive: true });
    const dirs = readdirSync(COM_DIR),
      coms = [];

    for (const dir of dirs) {
      if (dir.startsWith(".")) {
        continue;
      }
      const readme_path = join(COM_DIR, dir, "i18n/zh/README.md"),
        demo_path = join(COM_DIR, dir, "Demo.svelte"),
        has_readme = existsSync(readme_path),
        has_demo = existsSync(demo_path);

      if (has_readme && has_demo) {
        if (ctx) {
          ctx.addWatchFile(readme_path);
        }
        const readme = readFileSync(readme_path, "utf-8"),
          lines = readme.split("\n"),
          first_line = (lines[0] || "").replace(/^#\s*/, "").trim(),
          demo_import = "() => import('../../com/" + dir + "/Demo.svelte')";

        coms.push([dir, first_line, "() => import('./com/" + dir + ".js')"]);

        write(
          join(GEN_DIR, dir + ".js"),
          "export default [\n  " + JSON.stringify(readme) + ",\n  " + demo_import + "\n];\n",
        );
      } else {
        const missing = [];
        if (!has_readme) {
          missing.push("i18n/zh/README.md");
        }
        if (!has_demo) {
          missing.push("Demo.svelte");
        }
        console.warn("⚠️ com/" + dir + " 缺少 " + missing.join(" 和 "));
      }
    }

    write(
      join(ROOT, "gen/com.js"),
      "export default [\n  " +
        coms
          .map(
            (c) =>
              "[\n    " +
              JSON.stringify(c[0]) +
              ",\n    " +
              JSON.stringify(c[1]) +
              ",\n    " +
              c[2] +
              "\n  ]",
          )
          .join(",\n  ") +
        "\n];\n",
    );
  };

export default () => ({
  name: "com-docs-plugin",
  buildStart() {
    compileDocs(this);
  },
  configureServer: (server) => {
    server.watcher.add(COM_DIR);
    server.watcher.on("all", (event, file) => {
      if (file.endsWith("README.md") || file.endsWith("Demo.svelte")) {
        compileDocs();
        server.ws.send({ type: "full-reload" });
      }
    });
  },
});
