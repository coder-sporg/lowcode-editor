import React from "react"
import { Component, useComponentsStore } from "../../store/components"
import { useComponentConfigStore } from "../../store/conponent-config"

export function EditArea() {
  const { components } = useComponentsStore()
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

  return <div className="h-[100%]">
    {/* <pre>
      {
        JSON.stringify(components, null, 2)
      }
    </pre> */}
    { renderComponents(components) }
  </div>
}
