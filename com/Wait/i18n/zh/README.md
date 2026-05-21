优雅的加载动画与表单提交遮罩

## 功能

- 独立加载：在元素上添加 `.wait` 类显示加载图标
- 表单遮罩：在表单上添加 `.ing` 类显示半透明遮罩与加载图标，防止重复提交

## 使用

```svelte
<template lang="pug">
// 独立加载动画
b.wait

// 表单提交遮罩
form.ing
  input(type="text")
  button(type="submit") 提交
</template>

<style lang="stylus">
@import "com/Wait/Wait.styl"
</style>
```
