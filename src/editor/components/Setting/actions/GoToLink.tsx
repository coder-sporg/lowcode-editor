import { Input } from "antd"
import { useComponentsStore } from "../../../store/components"
import { ComponentEvent } from "../../../store/component-config"

function GoToLink(props: { event: ComponentEvent }) {
  const { event } = props
  const { curComponent, curComponentId, updateComponentProps } = useComponentsStore()

  // 改变url
  function urlChange(eventName: string, value: string) {
    if(!curComponentId) return null

    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent?.props?.[eventName],
        url: value
      }
    })
  }

  return (
    <div className="mt-[10px]">
      <div className="flex items-center gap-[10px]">
        <div>链接：</div>
        <div>
          <Input
            style={{ width: 160 }}
            onChange={e => urlChange(event.name, e.target.value)}
            value={curComponent?.props?.[event.name]?.url}
          />
        </div>
      </div>
    </div>
  )
}

export default GoToLink
