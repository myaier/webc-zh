import pugPlugin from "./pug.js";
import styleMinify from "./styleMinify.js";
import icoGen from "./icoGen.js";
import ROOT from "./const/ROOT.js";
import comDocs from "./comDocs.js";
import pluginComm from "./pluginComm.js";

export default (is_build) => {
  const plugins = [...pluginComm(ROOT, is_build, true), icoGen(), pugPlugin(is_build), comDocs()];

  if (is_build) {
    plugins.push(styleMinify());
  }

  return plugins;
};
