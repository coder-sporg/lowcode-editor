import { useMemo } from "react"
import { useComponentConfigStore } from "../../store/component-config"
import { MaterialItem } from "../Materialtem"

export function Material() {
  const { componentConfig } = useComponentConfigStore()

  const components = useMemo(() => {
    return Object.values(componentConfig)
  }, [componentConfig])

  return <div>{
    components.map((item, index) => {
      return <MaterialItem key={item.name + index} name={item.name} />
    })
  }</div>
}
