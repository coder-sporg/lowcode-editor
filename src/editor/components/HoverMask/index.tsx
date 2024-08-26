import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { getComponentById, useComponentsStore } from "../../store/components"

interface HoverMaskProps {
  // 用于挂载高亮框和名字
  portalWrapperClassName: string
  containerClassName: string
  componentId: number
}

function HoverMask({ portalWrapperClassName, containerClassName, componentId }: HoverMaskProps) {
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    // 用于显示组件名称
    labelTop: 0,
    labelLeft: 0
  })

  useEffect(() => {
    updatePosition()
  }, [componentId])

  function updatePosition() {
    if(!componentId) return

    const container = document.querySelector(`.${containerClassName}`)
    if(!container) return

    const node = document.querySelector(`[data-component-id="${componentId}"]`)
    if(!node) return

    const { top, left, width, height } = node.getBoundingClientRect()
    const { top: containerTop, left: containerLeft } = container.getBoundingClientRect()
    // console.log(container.scrollTop, container.scrollLeft) // 0 0

    let labelTop = top - containerTop
    const labelLeft = left - containerLeft + width

    if(labelTop <= 0) {
      labelTop -= -20
    }

    setPosition({
      top: top - containerTop,
      left: left - containerLeft,
      width,
      height,
      labelLeft,
      labelTop
    })
  }

  // 这里的 el 会在组件销毁和重建时多次创建 wrapper
  // const el = useMemo(() => {
  //   const el = document.createElement('div')
  //   el.className = 'wrapper'

  //   const container = document.querySelector(`.${containerClassName}`)
  //   container!.appendChild(el)
  //   return el
  // }, [])

  const el = useMemo(() => {
    return document.querySelector(`.${portalWrapperClassName}`)!
  }, [])

  // 获取当前组件
  const { components } = useComponentsStore()
  const curComponent = useMemo(() => {
    return getComponentById(components, componentId)
  }, [componentId])

  return createPortal((
    <>
      <div style={{
        position: 'absolute',
        left: position.left,
        top: position.top,
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        border: "1px dashed blue",
        pointerEvents: "none",
        width: position.width,
        height: position.height,
        zIndex: 12,
        borderRadius: 4,
        boxSizing: 'border-box',
      }} />
      <div
        style={{
          position: "absolute",
          left: position.labelLeft,
          top: position.labelTop,
          fontSize: "14px",
          zIndex: 13,
          display: (!position.width || position.width < 10) ? "none" : "inline",
          transform: 'translate(-100%, -100%)', // 移到右上角
        }}
      >
        <div
            style={{
              padding: '0 8px',
              backgroundColor: 'blue',
              borderRadius: 4,
              color: '#fff',
              cursor: "pointer",
              whiteSpace: 'nowrap',
            }}
          >
            {curComponent?.desc}
          </div>
      </div>
    </>
  ), el)
}

export default HoverMask
