#!/usr/bin/env bun

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { DATA_URI_REGEX, SVG_TAG_REGEX, minifySvgContent, stagedFiles } from "./svg.js";

const args = process.argv.slice(2),
  minifySvelte = (file) => {
    const original = readFileSync(file, "utf8");
    let content = original,
      saved = 0,
      orig_size = 0;

    content = content.replace(DATA_URI_REGEX, (match, svg_data) => {
      try {
        const decoded = decodeURIComponent(svg_data),
          data = minifySvgContent(decoded);
        if (data) {
          const minimal = data
              .replaceAll('"', "'")
              .replaceAll("%", "%25")
              .replaceAll("#", "%23")
              .replaceAll("{", "%7B")
              .replaceAll("}", "%7D")
              .replaceAll("<", "%3C")
              .replaceAll(">", "%3E")
              .replace(/\s+/g, " "),
            opt_match = "data:image/svg+xml," + minimal;
          if (opt_match.length < match.length) {
            orig_size += match.length;
            saved += match.length - opt_match.length;
            return opt_match;
          }
        }
      } catch (e) {
        console.error(e);
      }
      return match;
    });

    content = content.replace(SVG_TAG_REGEX, (match) => {
      if (match.includes("{") || match.includes("}")) {
        return match;
      }
      const data = minifySvgContent(match);
      if (data && data.length < match.length) {
        orig_size += match.length;
        saved += match.length - data.length;
        return data;
      }
      return match;
    });

    if (content !== original) {
      writeFileSync(file, content, "utf8");
      if (orig_size > 0 && saved > 0) {
        const ratio = ((saved / orig_size) * 100).toFixed(2);
        console.log("[" + ratio + "%] 压缩: " + file + " (减少 " + saved + " 字节)");
      }
      return true;
    }
    return false;
  },
  main = () => {
    const files = args.length ? args : stagedFiles();
    let changed = false;

    for (const file of files) {
      if (file.endsWith(".svelte")) {
        if (minifySvelte(file)) {
          changed = true;
        }
      }
    }

    if (changed && !args.length) {
      try {
        execSync("git add -u", { stdio: "inherit" });
      } catch (e) {
        console.error("git add failed:", e);
      }
    }
  };

main();
