import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

export default () => ({
  name: "vite-plugin-com-svg",
  enforce: "post",
  transform(code, id) {
    const cleanId = id.split("?")[0];
    if (!cleanId.includes("/com/") || !/\.(styl|svelte|css|js|ts)$/.test(cleanId)) {
      return null;
    }

    const urlRegex = /url\(\s*['"]?([^'"/):][^'")]*?\.svg)['"]?\s*\)/g;
    let hasChanges = false;

    const newCode = code.replace(urlRegex, (match, relativePath) => {
      const svgPath = resolve(dirname(cleanId), relativePath);
      if (existsSync(svgPath)) {
        const svgContent = readFileSync(svgPath);
        const base64 = svgContent.toString("base64");
        hasChanges = true;
        return 'url("data:image/svg+xml;base64,' + base64 + '")';
      } else {
        console.warn("⚠️ [comSvg] File does NOT exist: " + svgPath);
      }
      return match;
    });

    if (hasChanges) {
      return {
        code: newCode,
        map: null,
      };
    }
    return null;
  },
});
