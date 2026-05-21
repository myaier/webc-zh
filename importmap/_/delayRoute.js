import { route } from "./route.js";

// 避免 onMount 之前，route 被触发，导致重复加载数据
export const delayRoute = (loadUrl) => {
  let t;
  const unbind = route(() => {
    t = setTimeout(() => {
      loadUrl();
    });
  });
  return () => {
    unbind();
    clearTimeout(t);
  };
};

export default delayRoute;
