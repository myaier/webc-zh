#!/usr/bin/env bun

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { minifySvgContent, stagedFiles } from "./svg.js";

const args = process.argv.slice(2),
  minifySvgFile = (file) => {
    const original = readFileSync(file, "utf8"),
      data = minifySvgContent(original);
    if (data && data.length < original.length) {
      writeFileSync(file, data, "utf8");
      const saved = original.length - data.length,
        ratio = ((saved / original.length) * 100).toFixed(2);
      console.log("[" + ratio + "%] 压缩: " + file + " (减少 " + saved + " 字节)");
      return true;
    }
    return false;
  },
  main = () => {
    const files = args.length ? args : stagedFiles();
    let changed = false;

    for (const file of files) {
      if (file.endsWith(".svg")) {
        if (minifySvgFile(file)) {
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
