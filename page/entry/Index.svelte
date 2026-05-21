<script>
import { onMount } from "svelte";
import { goto, nowUrl } from "_/route.js";
import { delayRoute } from "_/delayRoute.js";
import coms from "../../gen/com.js";
import Md from "../lib/Md.svelte";
import Aside from "../Index/Aside.svelte";
import Preview from "../Index/Preview.svelte";

let active_index = $state(-1),
  active_readme = $state(""),
  active_demo = $state(null);

const active_comp_info = $derived(coms[active_index]),
  load = async (index) => {
    active_index = index;
    const info = coms[index];
    if (info) {
      const [name, title, load_func] = info,
        m = await load_func(),
        [readme, demo_func] = m.default;

      active_readme = readme;
      if (demo_func) {
        const demo_mod = await demo_func();
        active_demo = demo_mod.default;
      } else {
        active_demo = null;
      }
    } else {
      active_readme = "";
      active_demo = null;
    }
  };

onMount(() => {
  return delayRoute(() => {
    const url = nowUrl();
    if (!url) {
      if (coms.length > 0) {
        goto(coms[0][0]);
      }
      return;
    }
    const index = coms.findIndex(([name]) => name.toLowerCase() == url.toLowerCase());
    load(index);
  });
});
</script>

<template lang="pug">
main
  Aside(bind:active_index={ active_index })

  section
    +if active_comp_info
      b
        article
          b
            h1 {active_comp_info[0]}
          Md(readme={ active_readme })

        Preview(active_demo={ active_demo })
      +else
        article
          h2 请选择一个组件查看文档
</template>

<style lang="stylus">
main
  display flex
  height 100dvh
  width 100vw
  background linear-gradient(135deg, #ffffff 0, #f0f4f8 100%)
  color #1d1d1f
  font-family -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
  overflow hidden

section
  flex 1
  display flex
  flex-direction column
  overflow hidden

  > b
    flex 1
    display flex
    overflow hidden
    background #ffffff33

    article
      flex 1
      padding 32px
      overflow hidden
      border-right 1px solid #0000000a
      display flex
      flex-direction column

      > b
        display flex
        align-items center
        gap 16px
        margin-bottom 24px
        padding-bottom 16px
        border-bottom 1px solid #0000000f

        h1
          margin 0
          font-size 28px
          font-weight 700
          color #1d1d1f

  > article
    flex 1
    display flex
    align-items center
    justify-content center
    color #86868b
</style>