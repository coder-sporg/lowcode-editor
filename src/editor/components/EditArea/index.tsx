import React, { MouseEventHandler, useState } from "react"
import { Component, useComponentsStore } from "../../store/components"
import { useComponentConfigStore } from "../../store/component-config"
import HoverMask from "../HoverMask"
import SelectMask from "../SelectMask"

export function EditArea() {
  const { components, curComponentId, setCurComponentId } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name]
      if(!config.component) return

      return React.createElement(config.component, {
        key: component.id,
        id: component.id,
        name: component.name,
        ...config.defaultProps,
        ...component.props
      },
    renderComponents(component.children ?? []))
    })
  }

  // 处理hover效果
  const [hoverComponentId, setHoverComponentId] = useState<number>()
  const handleMouseOver: MouseEventHandler = (e) => {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Event/composedPath
    // 触发事件到html根元素的路径
    const path = e.nativeEvent.composedPath()

    for (let i = 0; i < path.length; i++) {
      const ele = path[i] as HTMLElement;

      const componentId = ele.dataset?.componentId
      if(componentId) {
        setHoverComponentId(+componentId)
        return
      }
    }
  }

  // 处理点击
  const handleClick: MouseEventHandler = (e) => {
    const path = e.nativeEvent.composedPath()

    for (let i = 0; i < path.length; i++) {
      const ele = path[i] as HTMLElement;

      const componentId = ele.dataset?.componentId
      if(componentId) {
        setCurComponentId(+componentId)
        return
      }
    }
  }

  return <div
      className="h-[100%] edit-area"
      onMouseOver={handleMouseOver}
      onMouseLeave={() => setHoverComponentId(undefined)}
      onClick={handleClick}
    >
    { renderComponents(components) }
    {
      hoverComponentId && hoverComponentId !== curComponentId && (
        <HoverMask
          containerClassName="edit-area"
          componentId={hoverComponentId}
          portalWrapperClassName="portal-wrapper"
        />
      )
    }
    {curComponentId && (
      <SelectMask
        portalWrapperClassName='portal-wrapper'
        containerClassName='edit-area'
        componentId={curComponentId}
      />
    )}
    <div className="portal-wrapper"></div>
  </div>
}
