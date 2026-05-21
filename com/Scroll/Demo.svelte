<script>
import "./Scroll.js";
import "./Scroll.styl";

const show_vertical = true,
  show_horizontal = true,
  card_count = 6,
  gap = 8,
  cards = Array.from({ length: card_count * 2 });
</script>

<template lang="pug">
//- 1. 垂直滚动演示
+if show_vertical
  header
    b 垂直虚拟滚动条
  v-scroll
    b(style="gap: {gap}px")
      +each cards as _, i
        b(
          style="--theme-hue: {(i * 35) % 360}; --theme-hue-next: {(i * 35 + 15) % 360}"
        )

//- 2. 水平滚动演示
+if show_horizontal
  header
    b 水平虚拟滚动条
  h-scroll
    b(style="gap: {gap}px")
      +each cards as _, i
        b(
          style="--theme-hue: {(i * 45) % 360}; --theme-hue-next: {(i * 45 + 25) % 360}"
        )
</template>

<style lang="stylus">
header
  font-size 13px
  font-weight 600
  color #1d1d1f
  letter-spacing -0.01em
  margin-top 16px
  margin-bottom 12px
  display flex
  align-items center

  &:first-of-type
    margin-top 0

v-scroll
  width 100%
  height 400px
  display block
  background #ffffff66
  border 1px solid #0000000d
  border-radius 16px
  box-shadow inset 0 1px 0 #ffffff99
  margin-bottom 24px

  > b
    width 100%
    padding 20px
    box-sizing border-box
    display flex
    flex-direction column

    > b
      height 64px
      background linear-gradient(135deg, HSL(var(--theme-hue), 35%, 98%) 0, HSL(var(--theme-hue-next), 30%, 96%) 100%)
      border 1px solid HSL(var(--theme-hue), 25%, 91%)
      border-radius 16px
      box-shadow 0 2px 8px #00000003
      transition all 0.2s ease

      &:hover
        transform translateY(-1px)
        box-shadow 0 4px 12px #00000008

h-scroll
  width 100%
  height 280px
  display block
  background #ffffff66
  border 1px solid #0000000d
  border-radius 16px
  box-shadow inset 0 1px 0 #ffffff99

  > b
    padding 20px
    box-sizing border-box
    display flex
    align-items center
    height 100%

    > b
      width 140px
      height 100%
      border-radius 16px
      flex-shrink 0
      box-sizing border-box
      box-shadow 0 2px 8px #00000003
      background linear-gradient(135deg, HSL(var(--theme-hue), 35%, 96%) 0, HSL(var(--theme-hue-next), 30%, 93%) 100%)
      border 1px solid HSL(var(--theme-hue), 25%, 88%)
      transition all 0.2s ease

      &:hover
        transform translateY(-2px)
        box-shadow 0 4px 16px #0000000a
</style>