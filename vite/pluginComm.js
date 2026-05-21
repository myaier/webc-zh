import importmapPack from "./importmapPack.js";
import sveltePlugin from "./svelte.js";
import css2nest from "./css2nest.js";
import stylusPack from "./stylusPack.js";
import comSvg from "./comSvg.js";

export default (root, is_build, custom_element) => [
  comSvg(),
  importmapPack(is_build),
  sveltePlugin(root, custom_element),
  css2nest(is_build),
  stylusPack(is_build),
];
