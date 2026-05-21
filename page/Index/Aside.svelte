<script>
import coms from "../../gen/com.js";

let { active_index = $bindable() } = $props(),
  search_query = $state(""),
  nav_el = $state(null);

const filtered_comps = $derived(
  (() => {
    const q = search_query.trim().toLowerCase(),
      kws = q ? q.split(/\s+/) : [];
    return coms
      .map((c, i) => [c, i])
      .filter(([[name, desc]]) => {
        if (!kws.length) return true;
        const n = name.toLowerCase(),
          d = desc.toLowerCase();
        return kws.some((kw) => n.includes(kw) || d.includes(kw));
      });
  })(),
);

$effect(() => {
  const _ = filtered_comps;
  if (!nav_el) return;
  if (typeof CSS == "undefined" || !CSS.highlights) return;

  CSS.highlights.delete("search-match");

  const q = search_query.trim().toLowerCase(),
    kws = q ? q.split(/\s+/).filter(Boolean) : [];
  if (!kws.length) return;

  const ranges = [],
    walk = document.createTreeWalker(nav_el, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walk.nextNode())) {
    if (node.parentElement?.classList?.contains("arrow")) continue;

    const text = node.textContent.toLowerCase();

    for (const kw of kws) {
      let pos = 0;
      while ((pos = text.indexOf(kw, pos)) != -1) {
        const range = new Range();
        range.setStart(node, pos);
        range.setEnd(node, pos + kw.length);
        ranges.push(range);
        pos += kw.length;
      }
    }
  }

  if (ranges.length) {
    const highlight = new Highlight(...ranges);
    CSS.highlights.set("search-match", highlight);
  }
});
</script>

<template lang="pug">
aside
  header
    b
      b 组件文档中心
  b
    input(type="text" placeholder="搜索组件..." bind:value={ search_query })
  nav(bind:this={ nav_el })
    +each filtered_comps as [[name, desc], idx]
      a(href!={ '/' + name } class!={ idx == active_index ? 'active' : '' })
        b.name {name}
        b.desc {desc}
        b.arrow →
</template>

<style lang="stylus">
aside
  width 280px
  background #ffffff66
  backdrop-filter blur(25px)
  border-right 1px solid #0000000f
  box-shadow inset -1px 0 0 #ffffff80, 0 4px 30px #00000005
  display flex
  flex-direction column
  flex-shrink 0

  header
    padding 24px
    border-bottom 1px solid #0000000a

    b
      display flex
      align-items center

      b
        font-size 18px
        font-weight 700
        background linear-gradient(135deg, #1d1d1f 0, #515154 100%)
        -webkit-background-clip text
        -webkit-text-fill-color transparent

  > b
    padding 16px 16px 8px
    position relative
    display flex

  nav
    flex 1
    overflow-y auto
    padding 8px 16px 16px
    display flex
    flex-direction column
    gap 6px

    a
      box-sizing border-box
      padding 12px 16px
      font-size 14px
      border-radius 10px
      font-family inherit
      transition all 0.25s ease
      display flex
      flex-direction column
      align-items stretch
      gap 4px
      background #ffffff10
      border 1px solid #00000005
      color #1d1d1f
      text-align left
      cursor pointer
      position relative
      text-decoration none

      &:hover
        background #00000008
        border-color #00000008

        .arrow
          opacity 1
          transform translateX(0)

      &.active
        background #0071e314
        border-color #0071e326
        color #0071e3
        box-shadow inset 0 1px 1px #ffffff99

        .desc
          color #0071e3cc

        .arrow
          opacity 1
          color #0071e3
          transform translateX(0)

      .name
        font-size 15px
        font-weight 600

      .desc
        font-size 12px
        color #86868b
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
        padding-right 20px
        font-weight 400
        transition color 0.25s ease

      .arrow
        position absolute
        right 16px
        top 50%
        margin-top -8px
        opacity 0
        transform translateX(-5px)
        transition all 0.25s ease

  input
    box-sizing border-box
    flex 1
    min-width 0
    padding 11px 16px
    font-size 14px
    border-radius 10px
    font-family inherit
    transition all 0.25s ease
    background #0000000a
    border 1px solid #0000000a
    color #1d1d1f
    outline none

    &::placeholder
      color #86868b

    &:focus
      border-color #0071e366
      background #ffffffcc
      box-shadow 0 0 0 3px #0071e326, 0 4px 12px #0000000a

:global(::highlight(search-match))
  background #ffe066
  color #000000
</style>