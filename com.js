#!/usr/bin/env bun

import { readdirSync, existsSync, statSync, mkdirSync, cpSync } from "node:fs";
import { join } from "node:path";
import { build } from "vite";
import configForCom from "./vite/com/vite.config.js";

const root = import.meta.dirname,
  com_dir = join(root, "com"),
  getComponents = () => {
    if (!existsSync(com_dir)) {
      return [];
    }
    return readdirSync(com_dir).filter((file) => {
      const p = join(com_dir, file);
      return statSync(p).isDirectory() && !file.startsWith(".");
    });
  },
  buildComponent = async (comp_name) => {
    const comp_path = join(com_dir, comp_name),
      svelte_file = join(comp_path, "Demo.svelte");

    if (!existsSync(svelte_file)) {
      return;
    }

    const config = configForCom(comp_name, root, true);
    await build(config);

    // Copy cursor folder if exists
    const cursor_dir = join(comp_path, "cursor");
    if (existsSync(cursor_dir) && statSync(cursor_dir).isDirectory()) {
      const dest_dir = join(root, "dist/com", comp_name, "cursor");
      mkdirSync(dest_dir, { recursive: true });
      cpSync(cursor_dir, dest_dir, { recursive: true });
    }

    // Copy svg folder if exists
    const svg_dir = join(comp_path, "svg");
    if (existsSync(svg_dir) && statSync(svg_dir).isDirectory()) {
      const dest_dir = join(root, "dist/com", comp_name, "svg");
      mkdirSync(dest_dir, { recursive: true });
      cpSync(svg_dir, dest_dir, { recursive: true });
    }
  },
  main = async () => {
    const components = getComponents();
    for (const comp of components) {
      await buildComponent(comp);
    }
  };

await main();
