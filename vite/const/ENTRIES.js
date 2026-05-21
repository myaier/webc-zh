import { readdirSync } from "node:fs";
import { join } from "node:path";
import ROOT from "./ROOT.js";

const ENTRY_DIR = join(ROOT, "page/entry"),
  FILES = readdirSync(ENTRY_DIR);

export default FILES.reduce((acc, file) => {
  if (file.endsWith(".js")) {
    const name = file.slice(0, -3),
      html_name = name + ".html";
    acc[html_name] = "page/entry/" + file;
  }
  return acc;
}, {});
