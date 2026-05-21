const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./Demo-C3kT1Q7t.js","./init-DMqhykfX.js","./init-ClQSGNbl.css","./Index-j-_esVTK.js","./legacy-DQ6vta3t.js"])))=>i.map(i=>d[i]);
import{t as e}from"./Index-j-_esVTK.js";var t=[`平滑流畅的自定义虚拟滚动条

## 功能

- **双向滚动**：提供垂直（\`v-scroll\`）和水平（\`h-scroll\`）两种独立的滚动容器。
- **自动响应**：实时监听内容与容器尺寸变化，动态更新滚动条尺寸与位置，无溢出时自动隐藏。
- **流畅交互**：支持常规滚轮滚动、拖拽滚动滑块以及点击轨道快速定位。
- **精致视觉**：悬停或滚动时自动显现且加宽滑块，带平滑过渡与微缩放动画，静止时自动隐藏。

## 使用

在 HTML/Pug 中直接使用自定义标签：

\`\`\`html
<!-- 垂直滚动 -->
<v-scroll>
  <div>滚动内容</div>
</v-scroll>

<!-- 水平滚动 -->
<h-scroll>
  <div>滚动内容</div>
</h-scroll>
\`\`\`

在 JS 中引入组件：

\`\`\`javascript
import "com/Scroll/scroll.js";
\`\`\`

## 演示代码

\`\`\`svelte
<script>
import "com/Scroll/scroll.js";
<\/script>

<template lang="pug">
v-scroll
  b(style="height: 1000px;") 垂直滚动内容
</template>

<style lang="stylus">
v-scroll
  width 300px
  height 400px
  border 1px solid #0000000f
</style>
\`\`\`
`,()=>e(()=>import(`./Demo-C3kT1Q7t.js`),__vite__mapDeps([0,1,2,3,4]),import.meta.url)];export{t as default};