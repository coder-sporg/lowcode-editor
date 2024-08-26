// import { message } from "antd"
import { useDrop } from "react-dnd"
import { useComponentsStore } from "../store/components"
import { useComponentConfigStore } from "../store/component-config"

export function useMaterialDrop(accept: string[], id: number) {
  const { addComponent } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  const [{ canDrop }, drop] = useDrop(() => ({
    accept,
    drop: (item: { type: string }, monitor) => {

      const didDrop = monitor.didDrop()
      // 已经做拖拽的不处理
      if(didDrop) return

      const config = componentConfig[item.type]
      addComponent({
        id: new Date().getTime(),
        name: item.type,
        desc: config.desc,
        props: config.defaultProps
      }, id)
      // message.success(item.type)
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop()
    })
  }))

  return { canDrop, drop }
}
