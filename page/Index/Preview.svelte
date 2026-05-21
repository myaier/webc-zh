<script>
let { active_demo } = $props();
</script>

<template lang="pug">
v-scroll
  +if active_demo
    +const DemoComponent = active_demo
    article
      b
        DemoComponent
    +else
      article.empty
        b 暂无可用演示
</template>

<style lang="stylus">
v-scroll
  flex 1

  article
    flex 1
    min-width 0
    padding 32px
    display flex
    flex-direction column

    &.empty
      height 100%
      align-items center
      justify-content center
      color #86868b

    b
      flex 1
      display flex
      flex-direction column
      gap 24px
      min-width 0
</style>