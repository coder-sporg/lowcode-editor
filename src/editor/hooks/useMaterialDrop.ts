// import { message } from "antd"
import { useDrop } from "react-dnd"
import { getComponentById, useComponentsStore } from "../store/components"
import { useComponentConfigStore } from "../store/component-config"

export interface ItemType {
  type: string
  dragType?: 'move' | 'add'
  id: number
}

export function useMaterialDrop(accept: string[], id: number) {
  const { addComponent, components, deleteComponent } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  const [{ canDrop }, drop] = useDrop(() => ({
    accept,
    drop: (item: ItemType, monitor) => {

      const didDrop = monitor.didDrop()
      // 已经做拖拽的不处理
      if(didDrop) return

      if(item.dragType === 'move') {
        const component = getComponentById(components, item.id)
        // 禁止拖动到自身
        if(component?.id === id) return
        deleteComponent(item.id)
        addComponent(component!, id)
      } else {
        // add
        const config = componentConfig[item.type]
        addComponent({
          id: new Date().getTime(),
          name: item.type,
          desc: config.desc,
          props: config.defaultProps
        }, id)
      }
      // message.success(item.type)
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop()
    })
  }))

  return { canDrop, drop }
}
