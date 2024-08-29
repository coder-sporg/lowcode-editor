# 低代码编辑器

## 技术
- 基于 `react-dnd` 实现了拖拽，可以拖拽物料到组件树的任意层级
- 通过 `zustand` 实现了全局 store 的存储，比如组件树、组件配置等，并用 persist 中间件做了持久化
- 通过 `tailwind` 来写样式，不需要写 css 文件
- 通过 `getBoundingClientRect` 拿到 hover、click 的组件边界，动态计算编辑框位置
- 通过 json 递归渲染组件，基于 `React.createElement` 来修改组件 `props`
- 通过 ref 实现了组件联动，组件通过 `forwardRef + useImperativeHandle` 暴露方法，然后全局注册，供别的组件调用

## 环境
- node: 18.20
- pnpm: 9.6.0
