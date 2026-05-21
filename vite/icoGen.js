import { existsSync } from "node:fs";
import { join } from "node:path";
import ROOT from "./const/ROOT.js";
import genIco from "./ico/gen.js";

export default () => ({
  name: "ico-gen",
  buildStart: async () => {
    if (!existsSync(join(ROOT, "public/favicon.ico"))) {
      await genIco();
    }
  },
});
