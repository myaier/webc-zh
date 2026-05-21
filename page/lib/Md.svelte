<script>
import { default_renderer, parser, parser_write, parser_end } from "streaming-markdown";

let { readme } = $props(),
  element = $state(null);

$effect(() => {
  if (element && readme) {
    element.innerHTML = "";
    const renderer = default_renderer(element),
      p = parser(renderer);
    parser_write(p, readme);
    parser_end(p);
  }
});
</script>

<template lang="pug">
v-scroll
  b(bind:this={ element })
</template>

<style lang="stylus">
v-scroll
  flex 1
  min-height 0

  b
    display block
    line-height 1.7
    color #333336

    :global(h1), :global(h2), :global(h3), :global(h4)
      color #1d1d1f
      font-weight 600
      margin-top 24px
      margin-bottom 16px

    :global(h1)
      font-size 26px
      border-bottom 1px solid #0000000f
      padding-bottom 8px

    :global(h2)
      font-size 20px
      border-bottom 1px solid #0000000a
      padding-bottom 6px

    :global(h3)
      font-size 16px

    :global(p)
      margin-bottom 16px

    :global(ul)
      margin-bottom 16px
      padding-left 20px
      list-style-type disc

      :global(li)
        margin-bottom 6px

    :global(code)
      font-family source-code-pro, Menlo, Monaco, Consolas, monospace
      font-size 13px
      background #0000000a
      padding 2px 6px
      border-radius 4px
      color #0071e3

    :global(pre)
      background #00000005
      border 1px solid #0000000d
      border-radius 12px
      padding 16px
      overflow-x auto
      margin-bottom 20px
      margin-top 12px

      :global(code)
        background transparent
        padding 0
        border-radius 0
        color #1d1d1f

    :global(a)
      color #0071e3
      text-decoration none
      border-bottom 1px solid #0071e333
      transition all 0.25s ease

      &:hover
        color #0077ed
        border-bottom-color #0077ed
</style>