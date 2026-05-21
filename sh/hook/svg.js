import { execSync } from "node:child_process";
import { optimize } from "svgo";

export const DATA_URI_REGEX = /data:image\/svg\+xml,([^"')\s\\]+)/g,
  SVG_TAG_REGEX = /<svg\b[^>]*>[\s\S]*?<\/svg>/g,
  stagedFiles = () => {
    try {
      return execSync("git diff --cached --name-only --diff-filter=ACM", { encoding: "utf8" })
        .trim()
        .split("\n")
        .filter(Boolean);
    } catch {
      return [];
    }
  },
  minifySvgContent = (content) => {
    try {
      const { data } = optimize(content, {
        multipass: true,
        plugins: ["preset-default", "removeViewBox"],
      });
      return data;
    } catch (e) {
      console.error(e);
      return content;
    }
  };
