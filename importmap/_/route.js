import { On } from "_/On.js";

export const nowUrl = () => location.pathname.slice(1),
  [route, setPre, preUrl, refresh, removeSlash, split, setUrl, goto] = (() => {
    let PRE = nowUrl(),
      HOOK = [];
    if (location.hash) PRE += location.hash;

    const HASH = "#",
      route = (hook) => {
        HOOK.push(hook);
        hook(nowUrl());
        return () => {
          HOOK = HOOK.filter((f) => f !== hook);
        };
      },
      setPre = (url) => {
        PRE = url;
      },
      preUrl = () => PRE,
      refresh = (url) => {
        url = url || nowUrl();
        for (const f of HOOK) f(url, PRE);
        setPre(url);
      },
      removeSlash = (url) => (url[0] === "/" ? url.slice(1) : url),
      split = (str, s) => {
        const p = str.indexOf(s);
        return p >= 0 ? [str.slice(0, p), str.slice(p + 1)] : [str, ""];
      },
      setUrl = (url) => {
        url = removeSlash(url);
        if (url !== PRE) {
          const [path, hash] = split(url, HASH),
            [p] = split(PRE, HASH);
          setPre(url);
          if (path !== p) {
            history.pushState(null, "", "/" + url);
            return 1;
          }
          if (location.hash.slice(1) !== hash) {
            location.hash = hash;
            return;
          }
        }
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      },
      goto = (url) => {
        if (setUrl(url)) refresh(url);
      };

    On(window, {
      popstate: () => {
        const url = nowUrl();
        if (url !== split(PRE, HASH)[0]) refresh(url);
      },
    });

    return [route, setPre, preUrl, refresh, removeSlash, split, setUrl, goto];
  })();
