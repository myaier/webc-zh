import CDN from "./cdn.page.js";

export default {
  _: (process.env.NODE_ENV === "production" ? CDN : '/') + "_.js",
};
